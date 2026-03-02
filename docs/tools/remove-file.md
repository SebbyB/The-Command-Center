---
name: remove-file
description: Remove a file entry previously added by add_file.py.
tech: Python
---

## Overview

`remove_file.py` is the inverse of `add_file.py`. It removes a `type: 'file'` entry from a section (or from the root filesystem) and deletes the backing TypeScript source file.

Root-level files (entries directly in `filesystem/index.ts`, not inside a section) are removed by passing `--path /`.

## Usage

```
python tools/remove_file.py <slug> --path <target-path> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `slug` | yes | File slug or filename (e.g. `my-notes` or `about.txt`) |
| `--path` | yes | Directory the file lives under, or `/` for root-level files. Supports nested paths (e.g. `docs/tools`). |
| `--dry-run` | no | Print what would be removed without modifying any files |
| `--tree` | no | Print the virtual filesystem tree after the operation |

## What Gets Removed

**Section or subdirectory files** (`--path <section>` or `--path <section/subdir>`):
- `src/filesystem/<path>/<slug>.ts` — deleted
- `src/filesystem/<path>/index.ts` — import and file entry removed

**Root-level files** (`--path /`):
- The source `.ts` file referenced by the import — deleted
- `src/filesystem/index.ts` — import line and children entry removed

## Examples

```bash
python tools/remove_file.py about.txt --path /
python tools/remove_file.py skills.json --path /
python tools/remove_file.py my-notes --path experience
python tools/remove_file.py my-notes --path experience --dry-run

# Nested subdirectory
python tools/remove_file.py notes --path docs/tools
```

## Notes

- Use `--path /` for files that live at the virtual filesystem root (i.e. readable with `cat about.txt` from `~`).
- Use `--path <section>` for files nested inside a section directory.
- Entries not found are reported and the script exits with an error rather than silently succeeding.
- After removing, run `npm run lint` to verify.
