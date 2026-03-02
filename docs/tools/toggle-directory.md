---
name: toggle-directory
description: Toggle a page entry between directory type and file type.
tech: Python
---

## Overview

`toggle_directory.py` switches a single entry inside a section between two types:

- **`directory`** — navigable with `cd`, appears in the section list, contains a `README.md`
- **`file`** — readable with `cat`, hidden from the section list, not navigable

When toggling `directory → file` the entry is also removed from `data.ts` (so it no longer appears in the section list). When toggling `file → directory` it is added back to `data.ts`.

Omit the slug to list all entries under a path and their current types.

## Usage

```
python tools/toggle_directory.py [<slug>] --path <path> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `slug` | no | Page slug to toggle. Omit to list all available entries under `--path`. |
| `--path` | yes | Directory the page lives under. Supports nested paths (e.g. `experience`, `docs/tools`). |
| `--dry-run` | no | Print output without writing any files |

## Examples

```bash
# List all entries and their current types
python tools/toggle_directory.py --path experience

# Toggle a specific entry
python tools/toggle_directory.py acme-job --path experience

# Preview the change without writing
python tools/toggle_directory.py acme-job --path experience --dry-run

# Inside a nested subdirectory
python tools/toggle_directory.py tree --path docs/tools
```

## What Gets Updated

**`directory → file`:**
- `src/filesystem/<path>/index.ts` — multi-line block replaced with single-line file entry
- `src/filesystem/<path>/data.ts` — import and array entry removed

**`file → directory`:**
- `src/filesystem/<path>/index.ts` — single-line entry expanded to full directory block
- `src/filesystem/<path>/data.ts` — import and array entry added

## Notes

- Only works on entries that have no sub-entries beyond `README.md`. Entries with additional children will cause an error.
- The backing `<slug>.ts` file is never modified — only the wiring in `index.ts` and `data.ts` changes.
- After writing, run `npm run lint` to verify.
