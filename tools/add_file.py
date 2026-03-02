#!/usr/bin/env python3
"""
add_file.py — Add a plain-text file entry to a virtual filesystem section.

Creates a type: 'file' entry readable with `cat` in the terminal.
Unlike md_to_page.py, the file does not appear in the section list and is not
navigable with `cd` — it is only accessible by name.

USAGE
    python tools/add_file.py <input.md> --path <target-path> [--dry-run]

ARGUMENTS
    input.md      Path to the source file.
    --path        Section/subdirectory to add the file under.
                  Supports nested paths: 'projects', 'docs/tools', etc.
    --dry-run     Print generated output without writing any files.

MARKDOWN FORMAT
    The file must start with a frontmatter block between --- delimiters.
    Everything after the closing --- becomes the file content (plain text).

    ---
    name: my-notes
    ---

    Content goes here. Accessible with `cat my-notes` in the terminal.
    Multiple lines are fine.
"""

import argparse
import re
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR,
    to_camel, ts_string, insert_after_last_import,
    path_parts, content_path,
    print_tree,
)

BLOCKED_PATHS = {"contact"}

# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def parse_md(text: str) -> tuple[str, str]:
    """Return (slug, body) from a frontmatter file."""
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not match:
        print("ERROR: No frontmatter block found. File must begin with ---")
        sys.exit(1)

    raw  = match.group(1)
    body = text[match.end():].strip()

    meta: dict = {}
    for line in raw.splitlines():
        if ":" in line:
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip()

    if "name" not in meta:
        print("ERROR: frontmatter missing required field 'name'")
        sys.exit(1)

    slug = meta["name"]
    if " " in slug:
        print(f"ERROR: 'name' must not contain spaces: '{slug}'")
        sys.exit(1)
    if not re.match(r"^[a-z0-9][a-z0-9\-_.]*$", slug):
        print(f"ERROR: 'name' must be lowercase with hyphens/dots only: '{slug}'")
        sys.exit(1)

    return slug, body

# ---------------------------------------------------------------------------
# TypeScript generation
# ---------------------------------------------------------------------------

def generate_ts(slug: str, body: str) -> str:
    camel = to_camel(slug)
    return f"export const {camel} = {ts_string(body)};\n"

# ---------------------------------------------------------------------------
# File mutation
# ---------------------------------------------------------------------------

def update_index_ts(slug: str, section_dir: Path, dry_run: bool) -> None:
    """Add a type:'file' entry to <section>/index.ts."""
    path    = section_dir / "index.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ {camel} }} from './{slug}';"
    if import_line in content:
        print(f"  [skip] {slug} already in {path.relative_to(ROOT)}")
        return

    content = insert_after_last_import(content, import_line)
    content = re.sub(r" = \{\};", " = {\n};", content)

    new_entry = f"\n  '{slug}': {{ type: 'file', content: {camel} }},"
    content   = re.sub(r"(\n)(};)$", new_entry + r"\n\2", content)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Add a plain-text file entry to a virtual filesystem section.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("input",     help="Path to the source file")
    parser.add_argument("--path",    required=True,
                        help="Section/subdirectory to add under (e.g. 'projects', 'docs/tools')")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print output without writing files")
    parser.add_argument("--tree", action="store_true",
                        help="Print the filesystem tree after the operation")
    args = parser.parse_args()

    target_path = args.path.strip("/")
    top_section = target_path.split("/")[0]

    if top_section in BLOCKED_PATHS:
        print(f"ERROR: '{top_section}' does not accept sub-entries.")
        sys.exit(1)

    parts       = path_parts(args.path)
    section_dir = FILESYSTEM_DIR / parts[0]
    cdir        = content_path(section_dir, parts[1:])

    if not cdir.is_dir():
        print(f"ERROR: Directory does not exist: {cdir.relative_to(ROOT)}")
        print(f"       Make sure '{target_path}' has been set up with index.ts.")
        sys.exit(1)

    md_path = Path(args.input)
    if not md_path.exists():
        print(f"ERROR: file not found: {md_path}")
        sys.exit(1)

    slug, body = parse_md(md_path.read_text())
    out_file   = cdir / f"{slug}.ts"
    ts_content = generate_ts(slug, body)

    print(f"\nAdding file entry '{slug}' under '{target_path}'")
    print(f"  Output: {out_file.relative_to(ROOT)}")

    if args.dry_run:
        print(f"\n--- {out_file.name} ---\n{ts_content}")
    else:
        if out_file.exists():
            print(f"  WARNING: {out_file.name} already exists — overwriting.")
        out_file.write_text(ts_content)
        print(f"  [created] {out_file.relative_to(ROOT)}")

    update_index_ts(slug, cdir, args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")

    if args.tree:
        print()
        print_tree()


if __name__ == "__main__":
    main()
