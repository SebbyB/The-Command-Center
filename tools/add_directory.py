#!/usr/bin/env python3
"""
add_directory.py — Add a section directory (top-level or nested) to the virtual filesystem.

Without --path: creates a top-level section with its own React component.
With --path:    creates a subdirectory inside an existing section (no .tsx component).

USAGE
    python tools/add_directory.py <name> [--description TEXT] [--dry-run]
    python tools/add_directory.py <name> --path <parent> [--dry-run]

ARGUMENTS
    name            Slug for the new directory. Lowercase letters, digits, hyphens.
    --path          Parent path for a subdirectory (e.g. 'docs', 'docs/tools').
                    Omit to create a top-level section.
    --description   Short description shown on the home screen (top-level only).
    --dry-run       Print generated output without writing any files.

EXAMPLES (top-level)
    python tools/add_directory.py blog --description "My blog posts"
    python tools/add_directory.py skills
    python tools/add_directory.py blog --dry-run

EXAMPLES (subdirectory)
    python tools/add_directory.py tools --path docs
    python tools/add_directory.py sub --path docs/tools --dry-run

WHAT GETS CREATED (top-level)
    src/filesystem/<name>/data.ts    — empty PageMeta list
    src/filesystem/<name>/index.ts   — exports the list and directory map
    src/sections/<Name>.tsx          — section list component

WHAT GETS CREATED (subdirectory)
    src/filesystem/<parent>/<name>/data.ts
    src/filesystem/<parent>/<name>/index.ts

WHAT GETS UPDATED
    Top-level:    src/filesystem/index.ts, src/filesystem/pageRegistry.ts
    Subdirectory: parent index.ts (entry), src/filesystem/pageRegistry.ts (list)
"""

import argparse
import re
import sys
from pathlib import Path

from _lib import (
    ROOT, FILESYSTEM_DIR, SECTIONS_DIR,
    to_camel, to_pascal, insert_after_last_import,
    path_parts, content_path, rel_up, dirs_var, list_var,
    update_page_registry, add_subdir_to_parent_index,
    print_tree,
)

_SUBDIR_LIST_IMPORT_TEMPLATE = "import SubdirList from '{rel}../sections/SubdirList';"

PROTECTED = set()

# ---------------------------------------------------------------------------
# Templates  (top-level — depth 0)
# ---------------------------------------------------------------------------

DATA_TS = """\
import type { PageMeta } from '../page-types';

const __CAMEL__List: PageMeta[] = [
];

export default __CAMEL__List;
"""

INDEX_TS = """\
import type { VirtualDirectory } from '../types';

export { default as __CAMEL__List } from './data';

export const __CAMEL__Directories: Record<string, VirtualDirectory> = {
};
"""

SECTION_TSX = """\
import React from 'react';
import { __CAMEL__List } from '../filesystem/__NAME__';
import { pageMap } from '../filesystem/pageRegistry';
import { useNavigation } from '../context/navigation';
import { cardHoverHandlers } from '../utils/hoverHandlers';
import SectionLayout from '../components/SectionLayout';

const __PASCAL__: React.FC = () => {
  const { currentPath, currentDir, onNavigate } = useNavigation();

  const subdirs = Object.keys(currentDir.children).filter(
    (name) => currentDir.children[name].type === 'directory' && !pageMap[name],
  );

  const totalCount = __CAMEL__List.length + subdirs.length;

  return (
    <SectionLayout withBackground>
        <div style={{ marginBottom: '2rem' }}>
          <span className="terminal-cyan">~/__NAME__</span>
          <span className="terminal-text-muted"> — {totalCount} entr{totalCount !== 1 ? 'ies' : 'y'}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {subdirs.map((name) => (
            <div
              key={name}
              onClick={() => onNavigate([...currentPath, name])}
              style={{
                background: 'var(--terminal-surface)',
                border: '1px solid rgba(33, 250, 144, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
              {...cardHoverHandlers}
            >
              <span className="terminal-cyan" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {name}/
              </span>
            </div>
          ))}

          {__CAMEL__List.map((entry) => (
            <div
              key={entry.name}
              onClick={() => onNavigate([...currentPath, entry.name])}
              style={{
                background: 'var(--terminal-surface)',
                border: '1px solid rgba(33, 250, 144, 0.2)',
                borderRadius: '8px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background 0.15s ease',
              }}
              {...cardHoverHandlers}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                <span className="terminal-cyan" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{entry.name}</span>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  {entry.repo && (
                    <a href={entry.repo} target="_blank" rel="noopener noreferrer" className="terminal-teal">
                      [repo]
                    </a>
                  )}
                  {entry.live && (
                    <a href={entry.live} target="_blank" rel="noopener noreferrer" className="terminal-teal">
                      [live]
                    </a>
                  )}
                </div>
              </div>

              <p className="terminal-text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{entry.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(entry.tech ?? []).map((t) => (
                  <span
                    key={t}
                    className="terminal-cyan"
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(33, 250, 144, 0.3)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
    </SectionLayout>
  );
};

export default __PASCAL__;
"""

def _fill(template: str, name: str) -> str:
    pascal = to_pascal(name)
    camel  = to_camel(name)
    return (template
        .replace("__NAME__",   name)
        .replace("__PASCAL__", pascal)
        .replace("__CAMEL__",  camel))

# ---------------------------------------------------------------------------
# Top-level file creation
# ---------------------------------------------------------------------------

def create_data_ts(name: str, section_dir: Path, dry_run: bool) -> None:
    content = _fill(DATA_TS, name)
    path = section_dir / "data.ts"
    if dry_run:
        print(f"\n--- {name}/data.ts ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [created] src/filesystem/{name}/data.ts")


def create_index_ts(name: str, section_dir: Path, dry_run: bool) -> None:
    content = _fill(INDEX_TS, name)
    path = section_dir / "index.ts"
    if dry_run:
        print(f"\n--- {name}/index.ts ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [created] src/filesystem/{name}/index.ts")


def create_section_tsx(name: str, dry_run: bool) -> None:
    pascal  = to_pascal(name)
    content = _fill(SECTION_TSX, name)
    path    = SECTIONS_DIR / f"{pascal}.tsx"
    if dry_run:
        print(f"\n--- sections/{pascal}.tsx ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [created] src/sections/{pascal}.tsx")

# ---------------------------------------------------------------------------
# Top-level filesystem/index.ts update
# ---------------------------------------------------------------------------

def update_filesystem_index(name: str, description: str, dry_run: bool) -> None:
    path    = FILESYSTEM_DIR / "index.ts"
    content = path.read_text()
    pascal  = to_pascal(name)
    camel   = to_camel(name)

    section_import = f"import {pascal} from '../sections/{pascal}';"
    dirs_import    = f"import {{ {camel}Directories }} from './{name}';"
    if section_import not in content:
        content = insert_after_last_import(content, section_import)
    if dirs_import not in content:
        content = insert_after_last_import(content, dirs_import)

    desc_ts   = description.replace("\\", "\\\\").replace("'", "\\'")
    new_entry = (
        f"    '{name}': {{\n"
        f"      type: 'directory',\n"
        f"      component: {pascal},\n"
        f"      description: '{desc_ts}',\n"
        f"      children: {camel}Directories,\n"
        f"    }},\n"
    )
    if f"'{name}':" not in content and f"\n    {name}:" not in content:
        if "    contact: {" in content:
            content = re.sub(r"(    contact: \{)", new_entry + r"    contact: {", content)
        else:
            content = re.sub(r"(\n)(  },\n)", r"\1" + new_entry + r"\2", content, count=1)

    if dry_run:
        print(f"\n--- filesystem/index.ts (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] src/filesystem/index.ts")

# ---------------------------------------------------------------------------
# Subdirectory file creation
# ---------------------------------------------------------------------------

def _subdir_data_ts(lvar: str, rel: str) -> str:
    return (
        f"import type {{ PageMeta }} from '{rel}page-types';\n"
        f"\n"
        f"const {lvar}: PageMeta[] = [\n"
        f"];\n"
        f"\n"
        f"export default {lvar};\n"
    )


def _subdir_index_ts(lvar: str, dvar: str, rel: str) -> str:
    return (
        f"import type {{ VirtualDirectory }} from '{rel}types';\n"
        f"\n"
        f"export {{ default as {lvar} }} from './data';\n"
        f"\n"
        f"export const {dvar}: Record<string, VirtualDirectory> = {{\n"
        f"}};\n"
    )


def create_subdir_data_ts(content_dir: Path, lvar: str, rel: str, dry_run: bool) -> None:
    content = _subdir_data_ts(lvar, rel)
    path = content_dir / "data.ts"
    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [created] {path.relative_to(ROOT)}")


def create_subdir_index_ts(content_dir: Path, lvar: str, dvar: str, rel: str,
                            dry_run: bool) -> None:
    content = _subdir_index_ts(lvar, dvar, rel)
    path = content_dir / "index.ts"
    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [created] {path.relative_to(ROOT)}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Add a section directory to the virtual filesystem.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("name",
                        help="Directory slug (e.g. blog, tools, my-work)")
    parser.add_argument("--path", default=None,
                        help="Parent path for a subdirectory (e.g. 'docs', 'docs/tools'). "
                             "Omit for a top-level section.")
    parser.add_argument("--description", default="",
                        help="Short description shown on the home screen (top-level only)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print output without writing files")
    parser.add_argument("--tree", action="store_true",
                        help="Print the filesystem tree after the operation")
    args = parser.parse_args()

    name = args.name.strip().lower()

    if not re.match(r"^[a-z][a-z0-9\-_]*$", name):
        print(f"ERROR: name must be lowercase with letters, digits, and hyphens: '{name}'")
        sys.exit(1)

    if name in PROTECTED:
        print(f"ERROR: '{name}' is protected and cannot be managed by this tool.")
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
        parent_sub   = parent_parts[1:]           # sub_parts of the parent within its section
        parent_dir   = content_path(section_dir, parent_sub)

        if not section_dir.is_dir():
            print(f"ERROR: Section '{section}' not found at {section_dir}")
            print(f"       Run 'python tools/add_directory.py {section}' first.")
            sys.exit(1)
        if not (parent_dir / "index.ts").exists():
            print(f"ERROR: {(parent_dir / 'index.ts').relative_to(ROOT)} not found.")
            parent_path = "/".join(parent_parts)
            parent_name = parent_parts[-1]
            grandparent = "/".join(parent_parts[:-1]) if len(parent_parts) > 1 else None
            if grandparent:
                print(f"       Run: python tools/add_directory.py {parent_name} --path {grandparent}")
            else:
                print(f"       Run: python tools/add_directory.py {parent_name}")
            sys.exit(1)

        content_dir  = parent_dir / name
        new_sub      = parent_sub + [name]       # sub_parts for the new subdir
        rel          = rel_up(new_sub)           # path from content_dir to src/filesystem/
        lvar         = list_var(section, new_sub)
        dvar         = dirs_var(section, new_sub)
        # SubdirList import path from the *parent*'s index.ts perspective
        subdir_imp = f"import SubdirList from '{rel_up(parent_sub)}../sections/SubdirList';"
        # Import path in pageRegistry.ts (relative to src/filesystem/)
        import_path  = "./" + "/".join(parent_parts + [name]) + "/data"

        if not args.dry_run:
            if content_dir.exists():
                print(f"ERROR: {content_dir.relative_to(ROOT)} already exists.")
                sys.exit(1)

        print(f"\nCreating subdirectory '{'/'.join(parent_parts)}/{name}'" +
              (" [dry-run]" if args.dry_run else ""))

        if not args.dry_run:
            content_dir.mkdir(parents=True)

        create_subdir_data_ts(content_dir, lvar, rel, args.dry_run)
        create_subdir_index_ts(content_dir, lvar, dvar, rel, args.dry_run)
        add_subdir_to_parent_index(name, parent_dir, dvar, subdir_imp, args.dry_run)
        update_page_registry(import_path, lvar, args.dry_run)

        if not args.dry_run:
            print(f"\nDone. Run 'npm run lint' to verify.")
            print(f"Use 'python tools/md_to_page.py <file>.md "
                  f"--path {'/'.join(parent_parts)}/{name}' to add entries.")
        else:
            print(f"\n[dry-run complete] No files were modified.")

        if args.tree:
            print()
            print_tree()
        return

    # ------------------------------------------------------------------
    # Top-level mode (original behavior)
    # ------------------------------------------------------------------
    section_dir = FILESYSTEM_DIR / name
    pascal      = to_pascal(name)
    section_tsx = SECTIONS_DIR / f"{pascal}.tsx"

    if not args.dry_run:
        if section_dir.exists():
            print(f"ERROR: src/filesystem/{name}/ already exists.")
            print(f"       Use md_to_page.py to add entries to an existing section.")
            sys.exit(1)
        if section_tsx.exists():
            print(f"ERROR: src/sections/{pascal}.tsx already exists.")
            sys.exit(1)

    print(f"\nCreating section '{name}'" + (" [dry-run]" if args.dry_run else ""))

    if not args.dry_run:
        section_dir.mkdir(parents=True)

    create_data_ts(name, section_dir, args.dry_run)
    create_index_ts(name, section_dir, args.dry_run)
    create_section_tsx(name, args.dry_run)
    update_filesystem_index(name, args.description, args.dry_run)

    camel = to_camel(name)
    update_page_registry(f"./{name}/data", f"{camel}List", args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")
        print(f"Use 'python tools/md_to_page.py <file>.md --path {name}' to add entries.")
    else:
        print(f"\n[dry-run complete] No files were modified.")

    if args.tree:
        print()
        print_tree()


if __name__ == "__main__":
    main()
