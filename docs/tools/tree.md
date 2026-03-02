---
name: tree
description: Display the virtual filesystem structure of the portfolio site.
tech: Python
---

## Overview

`tree.py` prints a visual tree of every section and page currently wired into the portfolio site's virtual filesystem. It reads the live TypeScript source files to reflect the exact state of the filesystem, including whether entries are `directory` or `file` type.

## Usage

```
python tools/tree.py
```

Run from the project root. No arguments required.

## Example Output

```
~
├── about.txt
├── skills.json
├── projects/
│   ├── command-center/
│   │   └── README.md
│   └── side-project/
│       └── README.md
├── experience/
│   ├── acme-corp/
│   │   └── README.md
│   └── old-job  (file)
└── contact/
```

Directory entries are shown with a trailing `/` and their `README.md` child. File-type entries are shown as plain names.

## Notes

- The tree reflects the actual contents of `src/filesystem/index.ts` and each section's `index.ts` — it always shows the current state.
- Root-level files and sections are read from `src/filesystem/index.ts`.
- Per-section entries are discovered from each section's `index.ts`.
- The `--tree` flag available on `add_page.py`, `add_directory.py`, `add_file.py`, `remove_page.py`, `remove_directory.py`, and `remove_file.py` calls this same renderer after their operation completes.
