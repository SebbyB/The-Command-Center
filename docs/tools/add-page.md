---
name: add-page
description: Add an empty page stub to a virtual filesystem section.
tech: Python
---

## Overview

`add_page.py` creates a minimal TypeScript page entry inside an existing section and wires it into the section's `data.ts` and `index.ts`. The generated stub can be filled in later by editing the file directly or by running `md_to_page.py` against a Markdown source.

## Usage

```
python tools/add_page.py <name> --path <section> [options]
```

Run from the project root. The target section must already exist — create one first with `add_directory.py` if needed.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `name` | yes | Slug for the new page. Lowercase kebab-case, no spaces. |
| `--path` | yes | Directory to add the page under. Use `/` or `~` for root (`~/`). Supports nested paths (e.g. `projects`, `docs/tools`). |
| `--description` | no | Short one-line description (default: `TODO: add description`) |
| `--dry-run` | no | Print generated output without writing any files |
| `--tree` | no | Print the virtual filesystem tree after the operation |

## What Gets Written

**Section or subdirectory** (`--path <section>` or `--path <section/subdir>`):
- `src/filesystem/<path>/<name>.ts` — stub with empty `meta` and `readme` exports
- `src/filesystem/<path>/data.ts` — updated to import and include the new entry
- `src/filesystem/<path>/index.ts` — updated with the directory entry and README

**Root** (`--path /`):
- `src/filesystem/<name>.ts` — stub page entry
- `src/filesystem/index.ts` — updated with the directory entry
- `src/filesystem/pageRegistry.ts` — updated with the meta import

## Examples

```bash
python tools/add_page.py my-project --path projects
python tools/add_page.py blog-post --path blog --description "First post"
python tools/add_page.py wip-page --path projects --dry-run
python tools/add_page.py new-entry --path experience --tree

# Root home directory
python tools/add_page.py readme --path /

# Nested subdirectory (docs/tools must exist — create with add_directory.py first)
python tools/add_page.py tree --path docs/tools
```

## Notes

- The `name` must match `^[a-z0-9][a-z0-9\-_]*$` — lowercase letters, digits, hyphens, or underscores only.
- If `<name>.ts` already exists it will be overwritten with a warning.
- To populate the stub with real content, run `md_to_page.py` against a Markdown file using the same `--path`.
- After writing, run `npm run lint` to verify the generated TypeScript.
