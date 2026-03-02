#!/usr/bin/env python3
"""
remove_file.py — Remove a file entry previously added by add_file.py.

For root-level files (about.txt, skills.json, etc.) use --path /.
For files inside a section use --path <section> or --path <section/subdir>.

USAGE
    python tools/remove_file.py <slug> --path <target-path> [--dry-run]

EXAMPLES
    python tools/remove_file.py about.txt --path /
    python tools/remove_file.py skills.json --path /
    python tools/remove_file.py my-notes --path experience
    python tools/remove_file.py my-notes --path docs/tools --dry-run
"""

import argparse
import re
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR,
    to_camel,
    path_parts, content_path,
    remove_ts_file,
    print_tree,
)

# ---------------------------------------------------------------------------
# Root-level file removal  (filesystem/index.ts  +  filesystem/files/<name>.ts)
# ---------------------------------------------------------------------------

def remove_root_file(slug: str, dry_run: bool) -> None:
    index_path = FILESYSTEM_DIR / "index.ts"
    content    = index_path.read_text()

    entry_pat = re.compile(
        r"^ *'%s' *: *\{ *type: *'file', *content: *(\w+) *\}.*$" % re.escape(slug),
        re.MULTILINE,
    )
    m = entry_pat.search(content)
    if not m:
        print(f"ERROR: '{slug}' not found in filesystem/index.ts children.")
        sys.exit(1)

    var_name   = m.group(1)
    entry_line = m.group(0)

    import_pat = re.compile(
        r"^import %s from '(\./[^']+)';$" % re.escape(var_name),
        re.MULTILINE,
    )
    im = import_pat.search(content)
    if im:
        rel    = im.group(1)
        src_ts = (FILESYSTEM_DIR / rel).with_suffix(".ts")
    else:
        print(f"  [warning] import for '{var_name}' not found — skipping source file.")
        src_ts = None

    if im:
        content = content.replace(im.group(0) + "\n", "")
    content = content.replace(entry_line + "\n", "")

    if dry_run:
        if src_ts:
            print(f"  [would delete] {src_ts.relative_to(ROOT)}")
        print(f"\n--- filesystem/index.ts (after removal) ---\n{content}")
    else:
        if src_ts and src_ts.exists():
            src_ts.unlink()
            print(f"  [deleted] {src_ts.relative_to(ROOT)}")
        elif src_ts:
            print(f"  [not found] {src_ts.relative_to(ROOT)} — skipping")
        index_path.write_text(content)
        print(f"  [updated] src/filesystem/index.ts")

# ---------------------------------------------------------------------------
# Section-level file removal  (<section>/index.ts  +  <section>/<slug>.ts)
# ---------------------------------------------------------------------------

def remove_from_index_ts(slug: str, section_dir: Path, dry_run: bool) -> None:
    """Remove a type:'file' entry from <section>/index.ts."""
    path = section_dir / "index.ts"
    if not path.exists():
        print(f"  [skip] {path.relative_to(ROOT)} not found")
        return

    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ {camel} }} from './{slug}';"
    if import_line not in content:
        print(f"  [not found] '{slug}' not in {path.relative_to(ROOT)} — skipping.")
        return

    content = content.replace(import_line + "\n", "")

    entry_line = f"  '{slug}': {{ type: 'file', content: {camel} }},"
    content    = content.replace(entry_line + "\n", "")

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Remove a file entry previously added by add_file.py.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("slug",
                        help="File slug or filename (e.g. 'my-notes' or 'about.txt')")
    parser.add_argument("--path", required=True,
                        help="Section/subdirectory the file lives under, "
                             "or '/' for root-level files")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be removed without modifying any files")
    parser.add_argument("--tree", action="store_true",
                        help="Print the filesystem tree after the operation")
    args = parser.parse_args()

    slug        = args.slug.strip("/")
    target_path = args.path.strip()

    print(f"\nRemoving file '{slug}'" + (" [dry-run]" if args.dry_run else ""))

    if target_path == "/":
        remove_root_file(slug, args.dry_run)
    else:
        parts = path_parts(target_path)
        cdir  = content_path(FILESYSTEM_DIR / parts[0], parts[1:])
        if not cdir.is_dir():
            print(f"ERROR: Directory not found: {cdir.relative_to(ROOT)}")
            sys.exit(1)
        remove_ts_file(slug, cdir, args.dry_run)
        remove_from_index_ts(slug, cdir, args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")
    else:
        print(f"\n[dry-run complete] No files were modified.")

    if args.tree:
        print()
        print_tree()


if __name__ == "__main__":
    main()
