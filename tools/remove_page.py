#!/usr/bin/env python3
"""
remove_page.py — Remove a page entry previously added by md_to_page.py.

All section directories follow the same pattern, so removal is symmetric:
the entry is removed from <section>/data.ts and <section>/index.ts, and the
.ts file is deleted.

USAGE
    python tools/remove_page.py <slug> --path <target-path> [--dry-run]

EXAMPLES
    python tools/remove_page.py my-project --path projects
    python tools/remove_page.py acme-job --path experience --dry-run
    python tools/remove_page.py tree --path docs/tools
"""

import argparse
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR,
    path_parts, content_path,
    remove_ts_file, remove_from_data_ts, remove_from_index_ts,
    remove_from_root_index_ts, remove_from_root_page_registry,
    print_tree,
)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Remove a page entry previously added by md_to_page.py.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("slug", help="Page slug (the 'name' field from frontmatter)")
    parser.add_argument("--path", required=True,
                        help="Section/subdirectory the page was added under "
                             "(e.g. 'projects', 'docs/tools')")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be removed without modifying any files")
    parser.add_argument("--tree", action="store_true",
                        help="Print the filesystem tree after the operation")
    args = parser.parse_args()

    slug        = args.slug.strip("/")
    is_root     = args.path.strip() in ("/", "~", "")
    target_path = "/" if is_root else args.path.strip("/")

    print(f"\nRemoving '{slug}' from '{target_path}'" + (" [dry-run]" if args.dry_run else ""))

    if is_root:
        remove_ts_file(slug, FILESYSTEM_DIR, args.dry_run)
        remove_from_root_index_ts(slug, args.dry_run)
        remove_from_root_page_registry(slug, args.dry_run)
    else:
        parts       = path_parts(args.path)
        section_dir = FILESYSTEM_DIR / parts[0]
        cdir        = content_path(section_dir, parts[1:])

        if not cdir.is_dir():
            print(f"ERROR: Directory not found: {cdir.relative_to(ROOT)}")
            sys.exit(1)

        remove_ts_file(slug, cdir, args.dry_run)
        remove_from_data_ts(slug, cdir, args.dry_run)
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
