---
name: add-directory
description: Add a section directory (top-level or nested) to the virtual filesystem.
tech: Python
---

## Overview

`add_directory.py` creates a new directory in the virtual filesystem. Without `--path` it scaffolds a complete top-level section (React component + data files). With `--path` it creates a subdirectory inside an existing section — no React component is needed because subdirectories inherit the parent section's component.

## Usage

```
# Top-level section
python tools/add_directory.py <name> [--description TEXT] [--dry-run]

# Subdirectory inside an existing section
python tools/add_directory.py <name> --path <parent> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `name` | yes | Slug for the new directory. Lowercase letters, digits, hyphens. |
| `--path` | no | Parent path for a subdirectory (e.g. `docs`, `docs/tools`). Omit for a top-level section. |
| `--description` | no | Short description shown on the home screen (top-level only) |
| `--dry-run` | no | Print generated output without writing any files |
| `--tree` | no | Print the virtual filesystem tree after the operation |

## What Gets Created (top-level, no --path)

| File | Purpose |
|---|---|
| `src/filesystem/<name>/data.ts` | Empty `PageMeta[]` list |
| `src/filesystem/<name>/index.ts` | Exports the list and directory map |
| `src/sections/<Name>.tsx` | Section list React component |

Updated: `src/filesystem/index.ts` (entry added), `src/filesystem/pageRegistry.ts` (list registered).

## What Gets Created (subdirectory, with --path)

| File | Purpose |
|---|---|
| `src/filesystem/<parent>/<name>/data.ts` | Empty `PageMeta[]` list |
| `src/filesystem/<parent>/<name>/index.ts` | Exports the list and directory map |

Updated: `src/filesystem/<parent>/index.ts` (entry added), `src/filesystem/pageRegistry.ts` (list registered).

No `.tsx` component is created — subdirectories use the generic `SubdirList` component, which reads children dynamically from the navigation context and works at any depth.

## Examples

```bash
# Top-level
python tools/add_directory.py blog --description "My blog posts"
python tools/add_directory.py skills --dry-run

# Subdirectory one level deep
python tools/add_directory.py tools --path docs
python tools/add_directory.py tools --path docs --dry-run

# Subdirectory two levels deep
python tools/add_directory.py sub --path docs/tools

# Any depth — pass the full parent path
python tools/add_directory.py deep --path docs/tools/sub
```

## Notes

- The `name` must match `^[a-z][a-z0-9\-_]*$`.
- Top-level: errors out if `src/filesystem/<name>/` or `src/sections/<Name>.tsx` already exist.
- Subdirectory: the parent must already have an `index.ts` (i.e. be set up with this tool).
- After creating, use `md_to_page.py` or `add_page.py` with the matching `--path` to populate it.
- After writing, run `npm run lint` to verify the generated TypeScript.
