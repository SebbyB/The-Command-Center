---
name: remove-command
description: Remove a custom terminal command from the portfolio site.
tech: Python
---

## Overview

`remove_command.py` reverses what `add_command.py` did. It removes the command's registration from `src/commands/index.ts` and deletes the command's `.ts` (or `.js`) source file.

## Usage

```
python tools/remove_command.py <name> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `name` | yes | Command name to remove (e.g. `ping`) |
| `--dry-run` | no | Print what would be removed without modifying any files |

## What Gets Removed

- `src/commands/<name>.ts` (or `.js`) — deleted
- `src/commands/index.ts` — import line and registration entry removed

## Protected Commands

The following built-in commands cannot be removed:

`help`, `whoami`, `ls`, `cd`, `cat`, `echo`, `clear`, `animations`

## Examples

```bash
python tools/remove_command.py ping
python tools/remove_command.py ping --dry-run
```

## Notes

- The tool accepts either a `.ts` or `.js` file in `src/commands/` — it checks for both extensions automatically.
- Attempting to remove a protected built-in command exits with an error.
- Attempting to remove a command not found in `index.ts` logs a `[not found]` notice and skips without error.
- After removing, run `npm run lint` to verify.
