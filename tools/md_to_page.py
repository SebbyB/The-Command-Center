#!/usr/bin/env python3
"""
md_to_page.py — Convert a Markdown file into a portfolio site page entry.

All section directories (projects, experience, education, …) follow the same
pattern: each has its own data.ts and index.ts that are auto-updated by this
script.

USAGE
    python tools/md_to_page.py <input.md> --path <target-path> [--dry-run]

ARGUMENTS
    input.md      Path to the source Markdown file.
    --path        Section/subdirectory to add the entry under.
                  Supports nested paths: 'projects', 'docs/tools', etc.
    --dry-run     Print generated output without writing any files.

EXAMPLES
    python tools/md_to_page.py my-project.md --path projects
    python tools/md_to_page.py acme-job.md --path experience --dry-run
    python tools/md_to_page.py tree.md --path docs/tools

MARKDOWN FORMAT
    The file must start with a frontmatter block between --- delimiters,
    followed by optional ## sections.

    Frontmatter fields:
        name          (required) Slug — lowercase kebab-case, no spaces.
        description   (required) Short one-line description.
        tech          (optional) Comma-separated technologies.
        repo          (optional) URL to source repository.
        live          (optional) URL to live deployment.
"""

import argparse
import re
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR,
    to_camel, ts_string,
    path_parts, content_path, rel_up,
    update_data_ts, update_index_ts,
    update_root_index_ts, update_root_page_registry,
)

# ---------------------------------------------------------------------------
# Markdown → HTML conversion
# ---------------------------------------------------------------------------

def _load_md_converter():
    try:
        import markdown as _md_lib
        def _convert(text: str) -> str:
            md = _md_lib.Markdown(extensions=["extra"], output_format="html")
            return md.convert(text)
        return _convert
    except ImportError:
        pass

    try:
        import mistune as _mistune
        _renderer = _mistune.html()  # type: ignore[attr-defined]
        def _convert(text: str) -> str:  # noqa: F811
            return _renderer(text)
        return _convert
    except ImportError:
        pass

    def _convert(text: str) -> str:  # noqa: F811
        import html as _html
        lines = text.splitlines()
        out: list[str] = []
        for line in lines:
            escaped = _html.escape(line)
            escaped = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", escaped)
            escaped = re.sub(r"__(.+?)__", r"<strong>\1</strong>", escaped)
            escaped = re.sub(r"\*(.+?)\*", r"<em>\1</em>", escaped)
            escaped = re.sub(r"_(.+?)_", r"<em>\1</em>", escaped)
            escaped = re.sub(r"`(.+?)`", r"<code>\1</code>", escaped)
            escaped = re.sub(r"\[(.+?)\]\((.+?)\)", r'<a href="\2">\1</a>', escaped)
            out.append(f"<p>{escaped}</p>" if escaped.strip() else "")
        return "\n".join(out)
    return _convert


_md_to_html = _load_md_converter()


def md_to_html(text: str) -> str:
    cleaned = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return _md_to_html(cleaned)


BLOCKED_PATHS: set[str] = set()

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def parse_md(text: str) -> tuple[dict, list[dict]]:
    fm, body = _split_frontmatter(text)
    sections = _parse_sections(body)
    return fm, sections


def _split_frontmatter(text: str) -> tuple[dict, str]:
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not match:
        print("ERROR: No frontmatter block found. File must begin with ---")
        sys.exit(1)

    raw  = match.group(1)
    rest = text[match.end():]

    meta: dict = {}
    for line in raw.splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip()

    for required in ("name", "description"):
        if required not in meta:
            print(f"ERROR: frontmatter missing required field '{required}'")
            sys.exit(1)

    name = meta["name"]
    if " " in name:
        print(f"ERROR: 'name' must not contain spaces: '{name}'")
        print("       Use kebab-case instead, e.g. '{}'".format(name.replace(" ", "-")))
        sys.exit(1)
    if not re.match(r"^[a-z0-9][a-z0-9\-_]*$", name):
        print(f"ERROR: 'name' must be lowercase kebab-case (a-z, 0-9, hyphens): '{name}'")
        sys.exit(1)

    return meta, rest


def _collect_references(body: str) -> str:
    refs = re.findall(r"^\[.+?\]:.+$", body, flags=re.MULTILINE)
    return "\n".join(refs)


def _parse_sections(body: str) -> list[dict]:
    refs_block = _collect_references(body)
    parts = re.split(r"^## (.+)$", body.strip(), flags=re.MULTILINE)
    sections = []
    for i in range(1, len(parts), 2):
        title = parts[i].strip()
        raw_content = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if refs_block and raw_content:
            raw_content = raw_content + "\n\n" + refs_block
        html_content = md_to_html(raw_content) if raw_content else ""
        sections.append({"title": title, "body": html_content})
    return sections

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def ts_array(items: list[str]) -> str:
    return "[" + ", ".join(f"'{i}'" for i in items) + "]"


def _readme_lines(name: str, fm: dict, tech: list[str]) -> list[str]:
    repo = fm.get("repo", "")
    live = fm.get("live", "")
    lines = ["export const readme = `# " + name, "", "${meta.description}"]
    if tech:
        lines += ["", "tech:  ${(meta.tech ?? []).join(' · ')}"]
    if repo:
        lines.append("repo:  ${meta.repo}")
    if live:
        lines.append("live:  ${meta.live}")
    lines += ["`;", ""]
    return lines

# ---------------------------------------------------------------------------
# TypeScript generation  (same template for all sections)
# ---------------------------------------------------------------------------

def generate_ts(fm: dict, sections: list[dict], types_import: str) -> str:
    name        = fm["name"]
    description = fm["description"]
    tech_raw    = fm.get("tech", "")
    tech        = [t.strip() for t in tech_raw.split(",") if t.strip()] if tech_raw else []
    repo        = fm.get("repo", "")
    live        = fm.get("live", "")

    lines = [
        types_import,
        "",
        "export const meta: PageMeta = {",
        f"  name: {ts_string(name)},",
        f"  description: {ts_string(description)},",
    ]
    if tech:
        lines.append(f"  tech: {ts_array(tech)},")
    if repo:
        lines.append(f"  repo: {ts_string(repo)},")
    if live:
        lines.append(f"  live: {ts_string(live)},")
    if sections:
        lines.append("  sections: [")
        for sec in sections:
            lines += ["    {", f"      title: {ts_string(sec['title'])},", f"      body: {ts_string(sec['body'])},", "    },"]
        lines.append("  ],")
    lines += ["};", ""]
    lines.extend(_readme_lines(name, fm, tech))
    return "\n".join(lines)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert a Markdown file into a portfolio site page entry.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input", help="Path to the source .md file")
    parser.add_argument("--path", required=True,
                        help="Section/subdirectory to add under (e.g. 'projects', 'docs/tools')")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print output without writing files")
    args = parser.parse_args()

    is_root     = args.path.strip() in ("/", "~", "")
    target_path = "/" if is_root else args.path.strip("/")

    if not is_root:
        top_section = target_path.split("/")[0]
        if top_section in BLOCKED_PATHS:
            print(f"ERROR: '{top_section}' does not accept sub-pages.")
            sys.exit(1)

    md_path = Path(args.input)
    if not md_path.exists():
        print(f"ERROR: file not found: {md_path}")
        sys.exit(1)

    text         = md_path.read_text()
    fm, sections = parse_md(text)
    slug         = fm["name"]

    if is_root:
        out_file     = FILESYSTEM_DIR / f"{slug}.ts"
        types_import = "import type { PageMeta } from './page-types';"
        ts_content   = generate_ts(fm, sections, types_import)

        print(f"\nGenerating page entry '{slug}' at root (~/) ")
        print(f"  Output: {out_file.relative_to(ROOT)}")

        if args.dry_run:
            print(f"\n--- {out_file.name} ---\n{ts_content}")
        else:
            if out_file.exists():
                print(f"  WARNING: {out_file.name} already exists — overwriting.")
            out_file.write_text(ts_content)
            print(f"  [created] {out_file.relative_to(ROOT)}")

        update_root_index_ts(slug, args.dry_run)
        update_root_page_registry(slug, args.dry_run)
    else:
        parts       = path_parts(args.path)
        section_dir = FILESYSTEM_DIR / parts[0]
        sub_parts   = parts[1:]
        cdir        = content_path(section_dir, sub_parts)

        if not cdir.is_dir():
            print(f"ERROR: Directory does not exist: {cdir.relative_to(ROOT)}")
            print(f"       Make sure '{target_path}' has been set up with data.ts and index.ts.")
            sys.exit(1)

        out_file     = cdir / f"{slug}.ts"
        rel          = rel_up(sub_parts)
        types_import = f"import type {{ PageMeta }} from '{rel}page-types';"
        page_imp     = f"import Page from '{rel}../sections/Page';"
        ts_content   = generate_ts(fm, sections, types_import)

        print(f"\nGenerating page entry '{slug}' under '{target_path}'")
        print(f"  Output: {out_file.relative_to(ROOT)}")

        if args.dry_run:
            print(f"\n--- {out_file.name} ---\n{ts_content}")
        else:
            if out_file.exists():
                print(f"  WARNING: {out_file.name} already exists — overwriting.")
            out_file.write_text(ts_content)
            print(f"  [created] {out_file.relative_to(ROOT)}")

        update_data_ts(slug, cdir, args.dry_run)
        update_index_ts(slug, cdir, args.dry_run, page_import=page_imp)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")


if __name__ == "__main__":
    main()
