#!/usr/bin/env python3
"""
add_command.py — Install a custom terminal command into the portfolio site.

Takes a .ts or .js file that exports a Command object and wires it into
src/commands/index.ts.

USAGE
    python tools/add_command.py <command-file> [--dry-run]

ARGUMENTS
    command-file   Path to a .ts or .js file exporting a default Command object.
                   The filename stem becomes the command name (e.g. ping.ts → ping).

COMMAND FILE FORMAT
    The file must export a default object matching the Command interface:

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

    The file is copied as-is into src/commands/. Any imports must already be
    relative to that directory (e.g. import type { Command } from './types';).

COMMAND NAMING
    The stem of the filename is used as the command name and must be a valid
    JavaScript identifier: lowercase letters, digits, and underscores only
    (e.g. ping, check_status, roll).
"""

import argparse
import re
import shutil
import sys
from pathlib import Path

from _lib import insert_after_last_import

ROOT         = Path(__file__).parent.parent
COMMANDS_DIR = ROOT / "src" / "commands"
INDEX_FILE   = COMMANDS_DIR / "index.ts"

VALID_NAME = re.compile(r"^[a-z][a-z0-9_]*$")
PROTECTED  = {"help", "whoami", "ls", "cd", "cat", "echo", "clear", "animations"}


def update_index(name: str, src_stem: str, dry_run: bool) -> None:
    content = INDEX_FILE.read_text()

    import_line = f"import {name} from './{src_stem}';"
    if import_line in content:
        print(f"  [skip] '{name}' already registered in index.ts")
        return

    content = insert_after_last_import(content, import_line)

    content = re.sub(
        r"(\n)(};\n\nexport default commands;)",
        rf"\n  {name},\1\2",
        content,
    )

    if dry_run:
        print(f"\n--- commands/index.ts (updated) ---\n{content}")
    else:
        INDEX_FILE.write_text(content)
        print(f"  [updated] src/commands/index.ts")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Install a custom terminal command into the portfolio site.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("command_file", help="Path to the .ts or .js command file")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print output without writing any files")
    args = parser.parse_args()

    src = Path(args.command_file)
    if not src.exists():
        print(f"ERROR: file not found: {src}")
        sys.exit(1)

    if src.suffix not in (".ts", ".js"):
        print(f"ERROR: file must be .ts or .js, got: {src.suffix}")
        sys.exit(1)

    name = src.stem
    if not VALID_NAME.match(name):
        print(f"ERROR: command name '{name}' must be lowercase letters, digits, "
              f"and underscores only (e.g. ping, check_status)")
        sys.exit(1)

    if name in PROTECTED:
        print(f"ERROR: '{name}' is a built-in command and cannot be overwritten.")
        sys.exit(1)

    dest = COMMANDS_DIR / src.name
    if dest.exists() and not args.dry_run:
        print(f"  WARNING: {dest.name} already exists — overwriting.")

    print(f"\nInstalling command '{name}'")
    print(f"  Source:  {src}")
    print(f"  Dest:    src/commands/{src.name}")

    if args.dry_run:
        print(f"\n--- {src.name} (copy of input) ---")
        print(src.read_text())
    else:
        shutil.copy2(src, dest)
        print(f"  [copied] src/commands/{src.name}")

    update_index(name, src.stem, args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")


if __name__ == "__main__":
    main()
