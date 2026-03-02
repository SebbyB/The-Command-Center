#!/usr/bin/env python3
"""
add_page.py — Add an empty page stub to a virtual filesystem section.

Creates a minimal TypeScript page entry and wires it into the section's
data.ts and index.ts. Fill in the content later with md_to_page.py or by
editing the generated file directly.

USAGE
    python tools/add_page.py <name> --path <section> [options]

ARGUMENTS
    name            Slug for the new page. Lowercase kebab-case, no spaces.
    --path          Section/subdirectory to add the page under.
                    Supports nested paths: 'projects', 'docs/tools', etc.

OPTIONS
    --description   Short one-line description (default: "TODO: add description").
    --dry-run       Print generated output without writing any files.

EXAMPLES
    python tools/add_page.py my-project --path projects
    python tools/add_page.py blog-post --path blog --description "First post"
    python tools/add_page.py wip-page --path docs/tools --dry-run
"""

import argparse
import re
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR,
    to_camel,
    path_parts, content_path, rel_up,
    update_data_ts, update_index_ts,
    update_root_index_ts, update_root_page_registry,
    print_tree,
)

# ---------------------------------------------------------------------------
# TypeScript generation
# ---------------------------------------------------------------------------

def generate_page_ts(slug: str, description: str,
                     types_import: str = "import type { PageMeta } from '../page-types';") -> str:
    escaped_desc = description.replace("'", "\\'")
    return (
        f"{types_import}\n"
        "\n"
        "export const meta: PageMeta = {\n"
        f"  name: '{slug}',\n"
        f"  description: '{escaped_desc}',\n"
        "};\n"
        "\n"
        "export const readme = `# " + slug + "\n"
        "\n"
        "${meta.description}\n"
        "`;\n"
    )

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Add an empty page stub to a virtual filesystem section.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("name",
                        help="Page slug (e.g. my-project, blog-post)")
    parser.add_argument("--path", required=True,
                        help="Section/subdirectory to add the page under (e.g. 'projects', 'docs/tools')")
    parser.add_argument("--description", default="TODO: add description",
                        help="Short one-line description")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print output without writing any files")
    parser.add_argument("--tree", action="store_true",
                        help="Print the filesystem tree after the operation")
    args = parser.parse_args()

    slug = args.name.strip()

    if " " in slug:
        print(f"ERROR: name must not contain spaces: '{slug}'")
        print(f"       Use kebab-case instead, e.g. '{slug.replace(' ', '-')}'")
        sys.exit(1)
    if not re.match(r"^[a-z0-9][a-z0-9\-_]*$", slug):
        print(f"ERROR: name must be lowercase kebab-case (a-z, 0-9, hyphens): '{slug}'")
        sys.exit(1)

    is_root     = args.path.strip() in ("/", "~", "")
    target_path = "/" if is_root else args.path.strip("/")

    if is_root:
        out_file     = FILESYSTEM_DIR / f"{slug}.ts"
        types_import = "import type { PageMeta } from './page-types';"
        ts_content   = generate_page_ts(slug, args.description, types_import)

        print(f"\nAdding empty page '{slug}' at root (~/) " +
              (" [dry-run]" if args.dry_run else ""))
        print(f"  Output: {out_file.relative_to(ROOT)}")

        if args.dry_run:
            print(f"\n--- {slug}.ts ---\n{ts_content}")
        else:
            if out_file.exists():
                print(f"  WARNING: {slug}.ts already exists — overwriting.")
            out_file.write_text(ts_content)
            print(f"  [created] {out_file.relative_to(ROOT)}")

        update_root_index_ts(slug, args.dry_run)
        update_root_page_registry(slug, args.dry_run)
    else:
        parts       = path_parts(args.path)
        section     = parts[0]
        sub_parts   = parts[1:]
        section_dir = FILESYSTEM_DIR / section
        cdir        = content_path(section_dir, sub_parts)

        if not cdir.is_dir():
            print(f"ERROR: directory not found: {cdir.relative_to(ROOT)}")
            print(f"       Run 'python tools/add_directory.py {args.path.strip('/')}' to create it first.")
            sys.exit(1)

        if not (cdir / "data.ts").exists():
            print(f"ERROR: {(cdir / 'data.ts').relative_to(ROOT)} not found.")
            print(f"       This directory was not set up with add_directory.py.")
            sys.exit(1)

        rel          = rel_up(sub_parts)
        types_import = f"import type {{ PageMeta }} from '{rel}page-types';"
        page_imp     = f"import Page from '{rel}../sections/Page';"

        out_file   = cdir / f"{slug}.ts"
        ts_content = generate_page_ts(slug, args.description, types_import)

        print(f"\nAdding empty page '{slug}' under '{target_path}'" +
              (" [dry-run]" if args.dry_run else ""))
        print(f"  Output: {out_file.relative_to(ROOT)}")

        if args.dry_run:
            print(f"\n--- {slug}.ts ---\n{ts_content}")
        else:
            if out_file.exists():
                print(f"  WARNING: {slug}.ts already exists — overwriting.")
            out_file.write_text(ts_content)
            print(f"  [created] {out_file.relative_to(ROOT)}")

        update_data_ts(slug, cdir, args.dry_run)
        update_index_ts(slug, cdir, args.dry_run, page_import=page_imp)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")
        print(f"Edit {out_file.relative_to(ROOT)} to add content,")
        print(f"or run 'python tools/md_to_page.py <file>.md --path {target_path}' to replace it.")
    else:
        print(f"\n[dry-run complete] No files were modified.")

    if args.tree:
        print()
        print_tree()


if __name__ == "__main__":
    main()
