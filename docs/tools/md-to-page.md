---
name: md-to-page
description: Convert a Markdown file into a portfolio site page entry.
tech: Python
---

## Overview

`md_to_page.py` turns a local `.md` file into a fully wired TypeScript page entry inside any virtual-filesystem section. It parses frontmatter for metadata, converts `##` body sections to HTML, writes `<slug>.ts`, and updates the section's `data.ts` and `index.ts` automatically.

## Usage

```
python tools/md_to_page.py <input.md> --path <target-path> [--dry-run]
```

Run from the project root. The section specified by `--path` must already exist (created with `add_directory.py`).

## Arguments

| Argument | Required | Description |
|---|---|---|
| `input.md` | yes | Path to the source Markdown file |
| `--path` | yes | Directory to add the entry under. Use `/` or `~` for the root (`~/`). Supports nested paths (e.g. `projects`, `docs/tools`). |
| `--dry-run` | no | Print generated output without writing any files |

## Markdown Format

The file must open with a YAML frontmatter block delimited by `---`, followed by optional `##` sections whose content becomes the page body.

```markdown
---
name: my-project
description: A short one-line description.
tech: React, TypeScript, Vite
repo: https://github.com/you/my-project
live: https://my-project.example.com
---

## Overview

What the project does.

## Features

- Feature one
- Feature two
```

**Frontmatter fields:**

| Field | Required | Notes |
|---|---|---|
| `name` | yes | Slug — lowercase kebab-case, no spaces (`a-z`, `0-9`, `-`, `_`) |
| `description` | yes | Short one-line description |
| `tech` | no | Comma-separated technology list |
| `repo` | no | URL to source repository |
| `live` | no | URL to live deployment |

## What Gets Written

**Section or subdirectory** (`--path <section>` or `--path <section/subdir>`):
- `src/filesystem/<path>/<slug>.ts` — TypeScript page entry with `meta` and `readme` exports
- `src/filesystem/<path>/data.ts` — updated to import and include the new entry
- `src/filesystem/<path>/index.ts` — updated with the directory entry and README

**Root** (`--path /`):
- `src/filesystem/<slug>.ts` — TypeScript page entry
- `src/filesystem/index.ts` — updated with the directory entry
- `src/filesystem/pageRegistry.ts` — updated with the meta import

## Examples

```bash
python tools/md_to_page.py my-project.md --path projects
python tools/md_to_page.py acme-job.md --path experience --dry-run

# Root home directory
python tools/md_to_page.py README.md --path /

# Nested subdirectory (docs/tools must exist — create with add_directory.py first)
python tools/md_to_page.py tree.md --path docs/tools
```

## Notes

- If `<slug>.ts` already exists it will be overwritten with a warning.
- Requires `markdown` or `mistune` for full HTML conversion; falls back to a basic inline renderer if neither is installed.
- After writing, run `npm run lint` to verify the generated TypeScript.
