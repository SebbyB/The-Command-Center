#!/usr/bin/env python3
"""
remove_directory.py — Remove a section directory from the virtual filesystem.

Without --path: removes a top-level section (reverses add_directory.py).
With --path:    removes a subdirectory inside an existing section.

USAGE
    python tools/remove_directory.py <name> [--dry-run]
    python tools/remove_directory.py <name> --path <parent> [--dry-run]

EXAMPLES (top-level)
    python tools/remove_directory.py blog
    python tools/remove_directory.py blog --dry-run

EXAMPLES (subdirectory)
    python tools/remove_directory.py tools --path docs
    python tools/remove_directory.py tools --path docs --dry-run
"""

import argparse
import re
import shutil
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR, SECTIONS_DIR,
    to_camel, to_pascal,
    path_parts, content_path, list_var,
    remove_from_page_registry, remove_subdir_from_parent_index,
    print_tree,
)

PROTECTED = set()

# ---------------------------------------------------------------------------
# Top-level removal helpers
# ---------------------------------------------------------------------------

def remove_filesystem_dir(name: str, dry_run: bool) -> None:
    section_dir = FILESYSTEM_DIR / name
    if not section_dir.exists():
        print(f"  [skip] src/filesystem/{name}/ not found")
        return
    n = len(list(section_dir.iterdir()))
    if dry_run:
        print(f"  [would delete] src/filesystem/{name}/  ({n} file(s))")
    else:
        shutil.rmtree(section_dir)
        print(f"  [deleted] src/filesystem/{name}/")


def remove_section_tsx(name: str, dry_run: bool) -> None:
    pascal = to_pascal(name)
    path   = SECTIONS_DIR / f"{pascal}.tsx"
    if not path.exists():
        print(f"  [skip] src/sections/{pascal}.tsx not found")
        return
    if dry_run:
        print(f"  [would delete] src/sections/{pascal}.tsx")
    else:
        path.unlink()
        print(f"  [deleted] src/sections/{pascal}.tsx")


def remove_from_filesystem_index(name: str, dry_run: bool) -> None:
    path    = FILESYSTEM_DIR / "index.ts"
    content = path.read_text()
    pascal  = to_pascal(name)
    camel   = to_camel(name)

    for line in [
        f"import {pascal} from '../sections/{pascal}';",
        f"import {{ {camel}Directories }} from './{name}';",
    ]:
        content = content.replace(line + "\n", "")

    lines = content.split("\n")
    start = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith(f"'{name}': {{") or stripped.startswith(f"{name}: {{"):
            start = i
            break

    if start is not None:
        depth = 0
        end   = start
        for i in range(start, len(lines)):
            depth += lines[i].count("{") - lines[i].count("}")
            if depth == 0:
                end = i
                break
        del lines[start : end + 1]
        content = "\n".join(lines)

    if dry_run:
        print(f"\n--- filesystem/index.ts (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] src/filesystem/index.ts")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Remove a section directory from the virtual filesystem.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("name",      help="Directory slug to remove (e.g. blog, tools)")
    parser.add_argument("--path", default=None,
                        help="Parent path for subdirectory removal "
                             "(e.g. 'docs', 'docs/tools'). "
                             "Omit to remove a top-level section.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be removed without modifying any files")
    parser.add_argument("--tree", action="store_true",
                        help="Print the filesystem tree after the operation")
    args = parser.parse_args()

    name = args.name.strip().lower()

    if name in PROTECTED:
        print(f"ERROR: '{name}' is protected and cannot be removed by this tool.")
        sys.exit(1)

    # ------------------------------------------------------------------
    # Subdirectory mode
    # ------------------------------------------------------------------
    if args.path is not None:
        parent_parts = path_parts(args.path)
        if not parent_parts:
            print("ERROR: --path must not be empty.")
            sys.exit(1)

        section      = parent_parts[0]
        section_dir  = FILESYSTEM_DIR / section
        parent_sub   = parent_parts[1:]
        parent_dir   = content_path(section_dir, parent_sub)
        content_dir  = parent_dir / name

        if not content_dir.is_dir():
            print(f"ERROR: {content_dir.relative_to(ROOT)} not found.")
            sys.exit(1)

        # Compute lvar/import_path for pageRegistry removal
        new_sub      = parent_sub + [name]
        lvar         = list_var(section, new_sub)
        import_path  = "./" + "/".join(parent_parts + [name]) + "/data"

        print(f"\nRemoving subdirectory '{'/'.join(parent_parts)}/{name}'" +
              (" [dry-run]" if args.dry_run else ""))

        remove_from_page_registry(import_path, lvar, args.dry_run)
        remove_subdir_from_parent_index(name, parent_dir, args.dry_run)

        n = sum(1 for _ in content_dir.rglob("*"))
        if args.dry_run:
            print(f"  [would delete] {content_dir.relative_to(ROOT)}/ ({n} item(s))")
        else:
            shutil.rmtree(content_dir)
            print(f"  [deleted] {content_dir.relative_to(ROOT)}/")

        if not args.dry_run:
            print(f"\nDone. Run 'npm run lint' to verify.")
        else:
            print(f"\n[dry-run complete] No files were modified.")

        if args.tree:
            print()
            print_tree()
        return

    # ------------------------------------------------------------------
    # Top-level mode (original behavior)
    # ------------------------------------------------------------------
    camel = to_camel(name)

    print(f"\nRemoving section '{name}'" + (" [dry-run]" if args.dry_run else ""))

    remove_filesystem_dir(name, args.dry_run)
    remove_section_tsx(name, args.dry_run)
    remove_from_filesystem_index(name, args.dry_run)
    remove_from_page_registry(f"./{name}/data", f"{camel}List", args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")
    else:
        print(f"\n[dry-run complete] No files were modified.")

    if args.tree:
        print()
        print_tree()


if __name__ == "__main__":
    main()
