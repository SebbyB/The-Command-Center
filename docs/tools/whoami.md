---
name: whoami
description: Update the content displayed by the whoami terminal command.
tech: Python, TypeScript
---

## Overview

`whoami.py` rewrites the `execute` body of `src/commands/whoami.ts` with new lines of text. Each line becomes a separate `addLine()` call in the terminal. Optionally updates the command description shown in `help`.

Lines can be passed directly as positional arguments or read from a plain-text file.

## Usage

```
python tools/whoami.py [options] "Line 1" "Line 2" ...
python tools/whoami.py --file whoami.txt [options]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `LINE ...` | yes (or `--file`) | One or more strings to display. Each becomes a separate `addLine()` call. |
| `--file PATH` | yes (or lines) | Read lines from a plain-text file (one line per row). Blank lines are preserved as empty `addLine('')` calls. |
| `--description TEXT` | no | Update the command description shown in `help` |
| `--dry-run` | no | Print the resulting file without writing it |

## Examples

```bash
# Pass lines directly
python tools/whoami.py "Seb — Full-Stack Developer" "seb@example.com"

# Read from a file
python tools/whoami.py --file whoami.txt

# Preview without writing
python tools/whoami.py --file whoami.txt --dry-run

# Update both content and description
python tools/whoami.py --description "Show who I am" "Hi, I'm Seb." "Based in London."
```

## whoami.txt Format

Plain text, one line per `addLine()` call. Blank lines produce empty output lines in the terminal.

```
Seb — Full-Stack Developer
seb@example.com

React · TypeScript · Python
```

## Notes

- You must provide either positional line arguments or `--file`, not both.
- The tool uses a regex to locate the `execute` block and will error if `whoami.ts` has been edited into an unexpected shape.
- After writing, run `npm run lint` to verify the generated TypeScript.
