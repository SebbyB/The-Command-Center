---
name: add-file
description: Add a plain-text file entry to a virtual filesystem section.
tech: Python
---

## Overview

`add_file.py` creates a `type: 'file'` entry inside an existing section. Unlike a page created with `md_to_page.py`, a file entry does **not** appear in the section list and cannot be navigated with `cd` — it is only accessible by name with `cat` in the terminal.

This is useful for supplementary content like notes, changelogs, or config snippets that should live inside a section but not be listed as standalone pages.

## Usage

```
python tools/add_file.py <input.md> --path <target-path> [--dry-run]
```

Run from the project root. The target section must already exist.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `input.md` | yes | Path to the source file |
| `--path` | yes | Directory to add the file under. Supports nested paths (e.g. `projects`, `docs/tools`). |
| `--dry-run` | no | Print generated output without writing any files |
| `--tree` | no | Print the virtual filesystem tree after the operation |

## Markdown Format

The file must open with a frontmatter block. Only `name` is required. Everything after the closing `---` becomes the raw file content.

```markdown
---
name: my-notes
---

Content goes here. Accessible with `cat my-notes` in the terminal.
Multiple lines are fine.
```

**Frontmatter fields:**

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Slug — matches `^[a-z0-9][a-z0-9\-_.]*$` (dots allowed for filenames like `readme.txt`) |

## What Gets Written

- `src/filesystem/<path>/<slug>.ts` — exports the raw text content as a string constant
- `src/filesystem/<path>/index.ts` — updated with a `type: 'file'` entry

## Examples

```bash
python tools/add_file.py notes.md --path experience
python tools/add_file.py changelog.md --path projects --dry-run

# Nested subdirectory
python tools/add_file.py notes.md --path docs/tools
```

## Notes

- The `contact` section is blocked and does not accept sub-entries.
- If `<slug>.ts` already exists it will be overwritten with a warning.
- After writing, run `npm run lint` to verify the generated TypeScript.
