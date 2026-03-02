---
name: remove-page
description: Remove a page entry previously added by md_to_page.py or add_page.py.
tech: Python
---

## Overview

`remove_page.py` is the inverse of `md_to_page.py` and `add_page.py`. It removes the `<slug>.ts` file from the section and cleans up all references in the section's `data.ts` and `index.ts`.

## Usage

```
python tools/remove_page.py <slug> --path <target-path> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `slug` | yes | The page slug — the value of the `name` field from its frontmatter |
| `--path` | yes | Directory the page was added under. Use `/` or `~` for root (`~/`). Supports nested paths (e.g. `projects`, `docs/tools`). |
| `--dry-run` | no | Print what would be removed without modifying any files |
| `--tree` | no | Print the virtual filesystem tree after the operation |

## What Gets Removed

**Section or subdirectory** (`--path <section>` or `--path <section/subdir>`):
- `src/filesystem/<path>/<slug>.ts` — deleted
- `src/filesystem/<path>/data.ts` — import and array entry removed
- `src/filesystem/<path>/index.ts` — import and directory entry block removed

**Root** (`--path /`):
- `src/filesystem/<slug>.ts` — deleted
- `src/filesystem/index.ts` — import and entry block removed
- `src/filesystem/pageRegistry.ts` — meta import and entry removed

## Examples

```bash
python tools/remove_page.py my-project --path projects
python tools/remove_page.py acme-job --path experience --dry-run
python tools/remove_page.py old-entry --path blog --tree

# Root home directory
python tools/remove_page.py readme --path /

# Nested subdirectory
python tools/remove_page.py tree --path docs/tools
```

## Notes

- Errors out if `<slug>.ts` is not found.
- Entries not found in `data.ts` or `index.ts` are skipped with a warning rather than failing.
- After removing, run `npm run lint` to verify.
