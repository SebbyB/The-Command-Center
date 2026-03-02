---
name: remove-directory
description: Remove a section directory (top-level or nested) from the virtual filesystem.
tech: Python
---

## Overview

`remove_directory.py` reverses what `add_directory.py` did. Without `--path` it removes a top-level section: deletes the entire folder, the React component, and all wiring. With `--path` it removes a subdirectory: cleans the parent `index.ts` and `pageRegistry.ts` and deletes the folder — no `.tsx` file is touched.

In both modes the tool recursively walks the target directory before deleting it, removing every `pageRegistry.ts` entry for every nested `data.ts` it finds. This means you can remove a parent directory in one command even if it contains registered subdirectories — no need to remove children bottom-up first.

## Usage

```
# Top-level section
python tools/remove_directory.py <name> [--dry-run]

# Subdirectory inside an existing section
python tools/remove_directory.py <name> --path <parent> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `name` | yes | Directory slug to remove (e.g. `blog`, `tools`) |
| `--path` | no | Parent path for subdirectory removal (e.g. `docs`, `docs/tools`). Omit to remove a top-level section. |
| `--dry-run` | no | Print what would be removed without modifying any files |
| `--tree` | no | Print the virtual filesystem tree after the operation |

## What Gets Removed (top-level, no --path)

| File / Directory | Action |
|---|---|
| `src/filesystem/<name>/` | Deleted (entire directory with all contents) |
| `src/sections/<Name>.tsx` | Deleted |
| `src/filesystem/index.ts` | Import lines and children entry block removed |
| `src/filesystem/pageRegistry.ts` | Import lines and spread entries removed for every nested `data.ts` found inside the directory (recursive) |

## What Gets Removed (subdirectory, with --path)

| File / Directory | Action |
|---|---|
| `src/filesystem/<parent>/<name>/` | Deleted (entire directory with all contents) |
| `src/filesystem/<parent>/index.ts` | Import and entry block removed |
| `src/filesystem/pageRegistry.ts` | Import lines and spread entries removed for every nested `data.ts` found inside the directory (recursive) |

No `.tsx` file is modified.

## Examples

```bash
# Top-level
python tools/remove_directory.py blog
python tools/remove_directory.py blog --dry-run

# Subdirectory one level deep
python tools/remove_directory.py tools --path docs
python tools/remove_directory.py tools --path docs --dry-run

# Any depth — pass the full parent path
python tools/remove_directory.py sub --path docs/tools
```

## Notes

- This is a destructive operation — all `.ts` files inside the deleted directory are removed.
- Registry cleanup is recursive: removing a parent directory also removes all `pageRegistry.ts` entries for any subdirectories it contains. There is no need to remove children bottom-up first.
- Use `--dry-run` first to preview exactly what will be removed.
- Missing files are skipped with a `[skip]` notice rather than causing an error.
- After removing, run `npm run lint` to verify.
