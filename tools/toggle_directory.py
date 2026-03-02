#!/usr/bin/env python3
"""
toggle_directory.py — Toggle a page entry between directory and file type.

A 'directory' entry can be navigated with `cd` and contains a README.md.
A 'file' entry can only be read with `cat` and is hidden from the section list.

Only works on entries that have no sub-entries beyond README.md.

USAGE
    python tools/toggle_directory.py [<slug>] --path <path> [--dry-run]

    Omit <slug> to list all entries and their current types under <path>.

EXAMPLES
    python tools/toggle_directory.py --path experience
    python tools/toggle_directory.py acme-job --path experience
    python tools/toggle_directory.py acme-job --path experience --dry-run
    python tools/toggle_directory.py tree --path docs/tools
"""

import argparse
import re
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR,
    to_camel, insert_after_last_import,
    path_parts, content_path, rel_up,
    update_data_ts, remove_from_data_ts,
)

# ---------------------------------------------------------------------------
# index.ts entry detection
# ---------------------------------------------------------------------------

def _get_indent(line: str) -> str:
    return re.match(r"(\s*)", line).group(1)


def _find_entry(lines: list[str], slug: str) -> tuple[int, int, str]:
    """Return (start, end, type) for the slug entry in a section index.ts."""
    slug_line_idx = None
    for i, line in enumerate(lines):
        if line.strip().startswith(f"'{slug}':"):
            slug_line_idx = i
            break
    if slug_line_idx is None:
        raise ValueError(f"'{slug}' not found in index.ts")

    slug_line  = lines[slug_line_idx]
    entry_type = "file" if ("type: 'file'" in slug_line or 'type: "file"' in slug_line) else "directory"

    opens  = slug_line.count("{")
    closes = slug_line.count("}")
    if opens == closes:
        return slug_line_idx, slug_line_idx, entry_type

    depth   = opens - closes
    end_idx = slug_line_idx + 1
    while end_idx < len(lines) and depth > 0:
        depth += lines[end_idx].count("{") - lines[end_idx].count("}")
        if depth > 0:
            end_idx += 1
    return slug_line_idx, end_idx, entry_type


def _check_no_subdirs(lines: list[str], start: int, end: int, slug: str) -> None:
    for line in lines[start : end + 1]:
        s = line.strip()
        if s.startswith("'") and not s.startswith("'README.md'") and not s.startswith(f"'{slug}':") and "{" in s:
            raise ValueError(f"'{slug}' has sub-entries — cannot toggle.")


def _list_entries(section_dir: Path) -> list[tuple[str, str]]:
    index_path = section_dir / "index.ts"
    if not index_path.exists():
        return []
    lines = index_path.read_text().split("\n")
    entries = []
    for line in lines:
        m = re.match(r"\s+'([^']+)':\s*\{", line)
        if m and m.group(1) != "README.md":
            entry_type = "file" if "type: 'file'" in line else "directory"
            entries.append((m.group(1), entry_type))
    return entries

# ---------------------------------------------------------------------------
# Toggle in index.ts
# ---------------------------------------------------------------------------

def _toggle_index(section_dir: Path, slug: str, camel: str,
                  page_import: str, dry_run: bool) -> str:
    path    = section_dir / "index.ts"
    content = path.read_text()
    lines   = content.split("\n")

    start, end, current_type = _find_entry(lines, slug)

    if current_type == "directory":
        _check_no_subdirs(lines, start, end, slug)

    indent = _get_indent(lines[start])
    pi     = indent + "  "
    ci     = indent + "    "

    readme_var = None
    for line in lines[start : end + 1]:
        m = re.search(r"content:\s+(\w+Readme)", line)
        if m:
            readme_var = m.group(1)
            break
    if not readme_var:
        readme_var = f"{camel}Readme"

    new_type = "file" if current_type == "directory" else "directory"

    if current_type == "directory":
        new_lines = [f"{indent}'{slug}': {{ type: 'file', content: {readme_var} }},"]
    else:
        # Ensure Page import is present when toggling to directory
        if page_import not in content:
            content = insert_after_last_import(content, page_import)
            lines   = content.split("\n")
            # Re-find the entry after the insertion
            start, end, _ = _find_entry(lines, slug)

        new_lines = [
            f"{indent}'{slug}': {{",
            f"{pi}type: 'directory',",
            f"{pi}component: Page,",
            f"{pi}children: {{",
            f"{ci}'README.md': {{ type: 'file', content: {readme_var} }},",
            f"{pi}}},",
            f"{indent}}},",
        ]

    lines[start : end + 1] = new_lines
    new_content = "\n".join(lines)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after toggle) ---\n{new_content}")
    else:
        path.write_text(new_content)
        print(f"  [updated] {path.relative_to(ROOT)}")

    return new_type

# ---------------------------------------------------------------------------
# Toggle in data.ts  (add/remove meta entry)
# ---------------------------------------------------------------------------

def _toggle_data(section_dir: Path, slug: str, new_type: str, dry_run: bool) -> None:
    path = section_dir / "data.ts"
    if not path.exists():
        return

    if new_type == "directory":
        update_data_ts(slug, section_dir, dry_run)
    else:
        remove_from_data_ts(slug, section_dir, dry_run)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Toggle a page entry between directory and file type.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("slug", nargs="?",
                        help="Page slug to toggle (omit to list available entries)")
    parser.add_argument("--path", required=True,
                        help="Section/subdirectory the page lives under "
                             "(e.g. 'experience', 'docs/tools')")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print output without writing files")
    args = parser.parse_args()

    parts       = path_parts(args.path)
    section_dir = FILESYSTEM_DIR / parts[0]
    sub_parts   = parts[1:]
    cdir        = content_path(section_dir, sub_parts)

    if not cdir.is_dir():
        print(f"ERROR: Directory not found: {cdir}")
        sys.exit(1)

    if not args.slug:
        entries = _list_entries(cdir)
        if not entries:
            print(f"No entries found under '{args.path}'.")
        else:
            print(f"\nEntries under '{args.path}':")
            for slug, etype in entries:
                print(f"  {slug}  [{etype}]")
            print(f"\nUsage: python tools/toggle_directory.py <slug> --path {args.path}")
        sys.exit(0)

    slug      = args.slug.strip("/")
    camel     = to_camel(slug)
    page_imp  = f"import Page from '{rel_up(sub_parts)}../sections/Page';"

    index_path = cdir / "index.ts"
    if not index_path.exists():
        print(f"ERROR: {index_path} not found")
        sys.exit(1)

    lines = index_path.read_text().split("\n")
    try:
        start, end, current_type = _find_entry(lines, slug)
    except ValueError as e:
        print(f"ERROR: {e}")
        sys.exit(1)

    if current_type == "directory":
        try:
            _check_no_subdirs(lines, start, end, slug)
        except ValueError as e:
            print(f"ERROR: {e}")
            sys.exit(1)

    new_type = "file" if current_type == "directory" else "directory"
    print(f"\nToggling '{slug}' under '{args.path}': {current_type} → {new_type}")

    new_type = _toggle_index(cdir, slug, camel, page_imp, args.dry_run)
    _toggle_data(cdir, slug, new_type, args.dry_run)

    if not args.dry_run:
        print(f"\nDone. '{slug}' is now a {new_type}. Run 'npm run lint' to verify.")
    else:
        print(f"\n[dry-run complete] No files were modified.")


if __name__ == "__main__":
    main()
