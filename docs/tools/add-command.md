---
name: add-command
description: Install a custom terminal command into the portfolio site.
tech: Python, TypeScript
---

## Overview

`add_command.py` takes a `.ts` or `.js` file that exports a `Command` object and wires it into `src/commands/index.ts`, making the command available in the terminal immediately after the next build.

## Usage

```
python tools/add_command.py <command-file> [--dry-run]
```

Run from the project root.

## Arguments

| Argument | Required | Description |
|---|---|---|
| `command-file` | yes | Path to a `.ts` or `.js` file exporting a default `Command` object |
| `--dry-run` | no | Print generated output without writing any files |

## Command File Format

The file must export a default object matching the `Command` interface. The filename stem becomes the command name (e.g. `ping.ts` → `ping`).

```typescript
import type { Command } from './types';

const ping: Command = {
  description: 'Ping the home server',
  execute: async ({ args, addLine }) => {
    addLine('Pinging...');
    try {
      const res = await fetch('https://example.com/ping');
      addLine(res.ok ? 'Server is up.' : 'Server returned ' + res.status, res.ok ? 'output' : 'error');
    } catch {
      addLine('Could not reach server.', 'error');
    }
  },
};

export default ping;
```

The file is **copied as-is** into `src/commands/`. Any imports must already be relative to that directory (e.g. `import type { Command } from './types';`).

## Command Naming

The stem of the filename is used as the command name and must match `^[a-z][a-z0-9_]*$` — lowercase letters, digits, and underscores only (e.g. `ping`, `check_status`, `roll`).

## Protected Commands

The following built-in commands cannot be overwritten:

`help`, `whoami`, `ls`, `cd`, `cat`, `echo`, `clear`, `animations`

## What Gets Written

- `src/commands/<name>.ts` — copied from source
- `src/commands/index.ts` — updated with import and registration

## Examples

```bash
python tools/add_command.py tools/example-content/commands/ping.ts
python tools/add_command.py my-command.ts --dry-run
```

## Notes

- If `<name>.ts` already exists in `src/commands/` it will be overwritten with a warning.
- After writing, run `npm run lint` to verify the generated TypeScript.
- To remove a command later, use `remove_command.py`.
