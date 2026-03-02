#!/usr/bin/env python3
"""
Shared helpers for portfolio-site tools.

Import what you need:
    from _lib import ROOT, FILESYSTEM_DIR, to_camel, insert_after_last_import, ...
"""

import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

ROOT           = Path(__file__).parent.parent
FILESYSTEM_DIR = ROOT / "src" / "filesystem"
SECTIONS_DIR   = ROOT / "src" / "sections"

# ---------------------------------------------------------------------------
# Name helpers
# ---------------------------------------------------------------------------

def to_camel(slug: str) -> str:
    parts = re.split(r"[-_]", slug)
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def to_pascal(slug: str) -> str:
    return "".join(w.capitalize() for w in re.split(r"[-_]", slug))

# ---------------------------------------------------------------------------
# Path helpers  (subdirectory support)
# ---------------------------------------------------------------------------

def path_parts(path: str) -> list[str]:
    """Return path segments, e.g. ['docs', 'tools'] from 'docs/tools'."""
    return [p for p in path.strip("/").split("/") if p]


def content_path(section_dir: Path, sub_parts: list[str]) -> Path:
    """Return the content directory for a (possibly nested) path.

    section_dir = FILESYSTEM_DIR / section
    sub_parts   = segments below the section
    """
    p = section_dir
    for part in sub_parts:
        p = p / part
    return p


def rel_up(sub_parts: list[str]) -> str:
    """Return the relative prefix from a content dir to src/filesystem/.

    len(sub_parts)==0 (top-level section) → '../'
    len(sub_parts)==1 (one subdir deep)   → '../../'
    """
    return "../" * (len(sub_parts) + 1)


def dirs_var(section: str, sub_parts: list[str]) -> str:
    """Camel-case directories export name, e.g. 'docsToolsDirectories'."""
    parts = [section] + list(sub_parts)
    return to_camel("-".join(parts)) + "Directories"


def list_var(section: str, sub_parts: list[str]) -> str:
    """Camel-case list export name, e.g. 'docsToolsList'."""
    parts = [section] + list(sub_parts)
    return to_camel("-".join(parts)) + "List"

# ---------------------------------------------------------------------------
# Content helpers
# ---------------------------------------------------------------------------

def insert_after_last_import(content: str, new_line: str) -> str:
    matches = list(re.finditer(r"^import .+;$", content, re.MULTILINE))
    if not matches:
        return new_line + "\n" + content
    pos = matches[-1].end()
    return content[:pos] + "\n" + new_line + content[pos:]


def ts_string(s: str) -> str:
    """Quote a string for TypeScript. Uses backticks for multiline, single quotes otherwise."""
    escaped = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    if "\n" in escaped:
        return f"`{escaped}`"
    return f"'{escaped.replace(chr(39), chr(92) + chr(39))}'"


def remove_line(content: str, line: str) -> str:
    return content.replace(line + "\n", "")

# ---------------------------------------------------------------------------
# Page entry operations  (shared by md_to_page, add_page, remove_page,
#                         toggle_directory)
# ---------------------------------------------------------------------------

def update_data_ts(slug: str, section_dir: Path, dry_run: bool) -> None:
    """Add import + array entry to <section>/data.ts."""
    path    = section_dir / "data.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ meta as {camel}Meta }} from './{slug}';"
    if import_line in content:
        print(f"  [skip] {slug} already in {path.relative_to(ROOT)}")
        return

    content = insert_after_last_import(content, import_line)
    content = re.sub(r" = \[\];", " = [\n];", content)
    content = re.sub(r"(\n)(];)", rf"\n  {camel}Meta,\1\2", content)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def update_index_ts(slug: str, section_dir: Path, dry_run: bool,
                    page_import: str | None = None) -> None:
    """Add import + directory entry to <section>/index.ts."""
    path    = section_dir / "index.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ readme as {camel}Readme }} from './{slug}';"
    if import_line in content:
        print(f"  [skip] {slug} already in {path.relative_to(ROOT)}")
        return

    if page_import is None:
        page_import = "import Page from '../../sections/Page';"
    if page_import not in content:
        content = insert_after_last_import(content, page_import)

    content = insert_after_last_import(content, import_line)
    content = re.sub(r" = \{\};", " = {\n};", content)

    new_entry = (
        f"\n  '{slug}': {{\n"
        f"    type: 'directory',\n"
        f"    component: Page,\n"
        f"    children: {{\n"
        f"      'README.md': {{ type: 'file', content: {camel}Readme }},\n"
        f"    }},\n"
        f"  }},"
    )
    content = re.sub(r"(\n)(};)$", new_entry + r"\n\2", content)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def remove_from_data_ts(slug: str, section_dir: Path, dry_run: bool) -> None:
    """Remove import + array entry from <section>/data.ts."""
    path = section_dir / "data.ts"
    if not path.exists():
        print(f"  [skip] {path.relative_to(ROOT)} not found")
        return

    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ meta as {camel}Meta }} from './{slug}';"
    if import_line not in content:
        print(f"  [not found] '{slug}' not in {path.relative_to(ROOT)} — skipping.")
        return

    content = remove_line(content, import_line)
    content = remove_line(content, f"  {camel}Meta,")

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def remove_from_index_ts(slug: str, section_dir: Path, dry_run: bool) -> None:
    """Remove import + directory block from <section>/index.ts (page/directory entries)."""
    path = section_dir / "index.ts"
    if not path.exists():
        print(f"  [skip] {path.relative_to(ROOT)} not found")
        return

    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ readme as {camel}Readme }} from './{slug}';"
    if import_line not in content:
        print(f"  [not found] '{slug}' not in {path.relative_to(ROOT)} — skipping.")
        return

    content = remove_line(content, import_line)

    # Remove the directory entry block by brace-counting
    lines = content.split("\n")
    slug_line_idx = None
    for i, line in enumerate(lines):
        if line.strip().startswith(f"'{slug}':"):
            slug_line_idx = i
            break

    if slug_line_idx is None:
        print(f"  [warning] entry block for '{slug}' not found in "
              f"{path.relative_to(ROOT)} — import removed.")
    else:
        slug_line = lines[slug_line_idx]
        opens  = slug_line.count("{")
        closes = slug_line.count("}")
        if opens == closes:
            end_idx = slug_line_idx
        else:
            depth   = opens - closes
            end_idx = slug_line_idx + 1
            while end_idx < len(lines) and depth > 0:
                depth += lines[end_idx].count("{") - lines[end_idx].count("}")
                if depth > 0:
                    end_idx += 1
        del lines[slug_line_idx : end_idx + 1]
        content = "\n".join(lines)

    # Drop the Page import if no directory entries remain (any depth)
    if "component: Page" not in content:
        content = re.sub(r"^import Page from '[^']+';\n", "", content, flags=re.MULTILINE)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def remove_ts_file(slug: str, section_dir: Path, dry_run: bool) -> None:
    """Delete <section>/<slug>.ts."""
    ts_file = section_dir / f"{slug}.ts"
    if not ts_file.exists():
        print(f"ERROR: {ts_file.relative_to(ROOT)} not found.")
        sys.exit(1)

    if dry_run:
        print(f"  [would delete] {ts_file.relative_to(ROOT)}")
    else:
        ts_file.unlink()
        print(f"  [deleted] {ts_file.relative_to(ROOT)}")

# ---------------------------------------------------------------------------
# Page registry operations  (shared by add_directory, remove_directory)
# ---------------------------------------------------------------------------

def update_page_registry(import_path: str, lvar: str, dry_run: bool) -> None:
    """Add an import + spread entry to pageRegistry.ts.

    import_path — path relative to src/filesystem/, e.g. './docs/data'
    lvar        — the list variable name, e.g. 'docsList'
    """
    path    = FILESYSTEM_DIR / "pageRegistry.ts"
    content = path.read_text()

    import_line = f"import {lvar} from '{import_path}';"
    if import_line not in content:
        content = insert_after_last_import(content, import_line)

    spread_line = f"  ...{lvar},"
    if spread_line not in content:
        content = re.sub(r"(\n];)", f"\n{spread_line}\\1", content, count=1)

    if dry_run:
        print(f"\n--- filesystem/pageRegistry.ts (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] src/filesystem/pageRegistry.ts")


def remove_from_page_registry(import_path: str, lvar: str, dry_run: bool) -> None:
    """Remove an import + spread entry from pageRegistry.ts.

    import_path — path relative to src/filesystem/, e.g. './docs/data'
    lvar        — the list variable name, e.g. 'docsList'
    """
    path    = FILESYSTEM_DIR / "pageRegistry.ts"
    content = path.read_text()

    content = content.replace(f"import {lvar} from '{import_path}';\n", "")
    content = content.replace(f"  ...{lvar},\n", "")

    if dry_run:
        print(f"\n--- filesystem/pageRegistry.ts (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] src/filesystem/pageRegistry.ts")

# ---------------------------------------------------------------------------
# Root-level page wiring  (--path / support for md_to_page, add_page, remove_page)
# ---------------------------------------------------------------------------

def update_root_index_ts(slug: str, dry_run: bool) -> None:
    """Add a Page entry to the root src/filesystem/index.ts."""
    path    = FILESYSTEM_DIR / "index.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ readme as {camel}Readme }} from './{slug}';"
    if import_line in content:
        print(f"  [skip] {slug} already in {path.relative_to(ROOT)}")
        return

    page_import = "import Page from '../sections/Page';"
    if page_import not in content:
        content = insert_after_last_import(content, page_import)

    content = insert_after_last_import(content, import_line)

    new_entry = (
        f"    '{slug}': {{\n"
        f"      type: 'directory',\n"
        f"      component: Page,\n"
        f"      children: {{\n"
        f"        'README.md': {{ type: 'file', content: {camel}Readme }},\n"
        f"      }},\n"
        f"    }},\n"
    )
    # Insert before the closing of the root children object
    content = content.replace("\n  },\n};", "\n" + new_entry + "  },\n};", 1)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def remove_from_root_index_ts(slug: str, dry_run: bool) -> None:
    """Remove a Page entry from src/filesystem/index.ts (root-level pages)."""
    path    = FILESYSTEM_DIR / "index.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ readme as {camel}Readme }} from './{slug}';"
    if import_line not in content:
        print(f"  [not found] '{slug}' not in {path.relative_to(ROOT)} — skipping.")
        return

    content = remove_line(content, import_line)

    lines = content.split("\n")
    slug_line_idx = None
    for i, line in enumerate(lines):
        if line.strip().startswith(f"'{slug}':"):
            slug_line_idx = i
            break

    if slug_line_idx is not None:
        depth   = lines[slug_line_idx].count("{") - lines[slug_line_idx].count("}")
        end_idx = slug_line_idx
        if depth > 0:
            end_idx = slug_line_idx + 1
            while end_idx < len(lines) and depth > 0:
                depth += lines[end_idx].count("{") - lines[end_idx].count("}")
                if depth > 0:
                    end_idx += 1
        del lines[slug_line_idx : end_idx + 1]
        content = "\n".join(lines)

    if "component: Page" not in content:
        content = re.sub(r"^import Page from '[^']+';\n", "", content, flags=re.MULTILINE)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def update_root_page_registry(slug: str, dry_run: bool) -> None:
    """Add a single meta import + entry to pageRegistry.ts (root-level pages)."""
    path    = FILESYSTEM_DIR / "pageRegistry.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    import_line = f"import {{ meta as {camel}Meta }} from './{slug}';"
    if import_line in content:
        print(f"  [skip] {slug} already in {path.relative_to(ROOT)}")
        return

    content = insert_after_last_import(content, import_line)

    entry_line = f"  {camel}Meta,"
    if entry_line not in content:
        content = re.sub(r"(\n];)", f"\n{entry_line}\\1", content, count=1)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def remove_from_root_page_registry(slug: str, dry_run: bool) -> None:
    """Remove a single meta import + entry from pageRegistry.ts (root-level pages)."""
    path    = FILESYSTEM_DIR / "pageRegistry.ts"
    content = path.read_text()
    camel   = to_camel(slug)

    content = content.replace(f"import {{ meta as {camel}Meta }} from './{slug}';\n", "")
    content = content.replace(f"  {camel}Meta,\n", "")

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")

# ---------------------------------------------------------------------------
# Subdirectory wiring  (shared by add_directory, remove_directory)
# ---------------------------------------------------------------------------

def add_subdir_to_parent_index(name: str, parent_dir: Path, dvar: str,
                                subdir_import: str, dry_run: bool) -> None:
    """Add 'name': { type:'directory', component:SubdirList, children:<dvar> } to parent_dir/index.ts."""
    path = parent_dir / "index.ts"
    if not path.exists():
        print(f"ERROR: {path.relative_to(ROOT)} not found.")
        sys.exit(1)

    content = path.read_text()

    import_line = f"import {{ {dvar} }} from './{name}';"
    if import_line in content:
        print(f"  [skip] {name} already in {path.relative_to(ROOT)}")
        return

    if subdir_import not in content:
        content = insert_after_last_import(content, subdir_import)

    content = insert_after_last_import(content, import_line)
    content = re.sub(r" = \{\};", " = {\n};", content)

    new_entry = (
        f"\n  '{name}': {{\n"
        f"    type: 'directory',\n"
        f"    component: SubdirList,\n"
        f"    children: {dvar},\n"
        f"  }},"
    )
    content = re.sub(r"(\n)(};)$", new_entry + r"\n\2", content)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (updated) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")


def remove_subdir_from_parent_index(name: str, parent_dir: Path, dry_run: bool) -> None:
    """Remove the subdirectory entry for 'name' from parent_dir/index.ts."""
    path = parent_dir / "index.ts"
    if not path.exists():
        print(f"  [skip] {path.relative_to(ROOT)} not found")
        return

    content = path.read_text()

    # Remove import line (regex because the exact var name is not known here)
    content = re.sub(
        rf"^import \{{ \w+ \}} from '\./{re.escape(name)}';\n",
        "",
        content,
        flags=re.MULTILINE,
    )

    # Remove the entry block by brace-counting
    lines = content.split("\n")
    slug_line_idx = None
    for i, line in enumerate(lines):
        if line.strip().startswith(f"'{name}':"):
            slug_line_idx = i
            break

    if slug_line_idx is None:
        print(f"  [warning] entry block for '{name}' not found in {path.relative_to(ROOT)}")
    else:
        depth   = lines[slug_line_idx].count("{") - lines[slug_line_idx].count("}")
        end_idx = slug_line_idx
        if depth > 0:
            end_idx = slug_line_idx + 1
            while end_idx < len(lines) and depth > 0:
                depth += lines[end_idx].count("{") - lines[end_idx].count("}")
                if depth > 0:
                    end_idx += 1
        del lines[slug_line_idx : end_idx + 1]
        content = "\n".join(lines)

    # Drop SubdirList import if no longer needed
    if "component: SubdirList" not in content:
        content = re.sub(r"^import SubdirList from '[^']+';\n", "", content, flags=re.MULTILINE)

    if dry_run:
        print(f"\n--- {path.relative_to(ROOT)} (after removal) ---\n{content}")
    else:
        path.write_text(content)
        print(f"  [updated] {path.relative_to(ROOT)}")

# ---------------------------------------------------------------------------
# Tree rendering  (shared with tree.py and --tree flag in add/remove tools)
# ---------------------------------------------------------------------------

_TREE_SKIP = {"data.ts", "index.ts"}


def _tree_section_entries(section_dir: Path) -> list[tuple[str, str]]:
    """Return [(slug, 'directory'|'file'|'subdir'), ...] for a section dir."""
    index_path = section_dir / "index.ts"
    if not index_path.exists():
        return []
    content = index_path.read_text()
    entries = []

    # Physical subdirectories with their own index.ts come first
    for subdir in sorted(section_dir.iterdir()):
        if subdir.is_dir() and (subdir / "index.ts").exists():
            entries.append((subdir.name, "subdir"))

    # .ts page/file entries
    for ts_file in sorted(section_dir.glob("*.ts")):
        if ts_file.name in _TREE_SKIP:
            continue
        slug       = ts_file.stem
        file_match = re.search(rf"'{re.escape(slug)}':\s*\{{\s*type:\s*'file'", content)
        entries.append((slug, "file" if file_match else "directory"))

    return entries


def _print_subtree(section_dir: Path, prefix: str) -> None:
    """Recursively print entries inside a section/subdirectory."""
    entries = _tree_section_entries(section_dir)
    for j, (slug, kind) in enumerate(entries):
        is_last   = j == len(entries) - 1
        conn      = "└──" if is_last else "├──"
        child_pre = prefix + ("    " if is_last else "│   ")
        if kind == "subdir":
            print(f"{prefix}{conn} {slug}/")
            _print_subtree(section_dir / slug, child_pre)
        elif kind == "directory":
            print(f"{prefix}{conn} {slug}/")
            print(f"{child_pre}└── README.md")
        else:
            print(f"{prefix}{conn} {slug}")


def print_tree() -> None:
    """Print the virtual filesystem tree to stdout."""
    index_content = (FILESYSTEM_DIR / "index.ts").read_text()

    root_files = re.findall(
        r"^\s{4}'([a-z][a-z0-9._-]+)'\s*:\s*\{\s*type:\s*'file'",
        index_content, re.MULTILINE,
    )
    sections  = re.findall(
        r"^\s{4}'?([a-z][a-z0-9_-]*)'?\s*:\s*\{",
        index_content, re.MULTILINE,
    )
    all_items = root_files + sections

    print("~")

    for name in root_files:
        is_last = name == all_items[-1] if all_items else True
        print(f"{'└──' if is_last else '├──'} {name}")

    for i, section in enumerate(sections):
        is_last      = (len(root_files) + i) == len(all_items) - 1
        connector    = "└──" if is_last else "├──"
        child_prefix = "    " if is_last else "│   "
        section_dir  = FILESYSTEM_DIR / section

        print(f"{connector} {section}/")
        if not section_dir.is_dir():
            continue

        _print_subtree(section_dir, child_prefix)
