#!/usr/bin/env python3
"""
remove_command.py — Remove a custom terminal command from the portfolio site.

Reverses what add_command.py did: removes the registration from index.ts
and deletes the command file.

USAGE
    python tools/remove_command.py <name> [--dry-run]

EXAMPLES
    python tools/remove_command.py ping
    python tools/remove_command.py ping --dry-run
"""

import argparse
import re
import sys
from pathlib import Path

ROOT         = Path(__file__).parent.parent
COMMANDS_DIR = ROOT / "src" / "commands"
INDEX_FILE   = COMMANDS_DIR / "index.ts"

PROTECTED = {"help", "whoami", "ls", "cd", "cat", "echo", "clear", "animations"}


def remove_from_index(name: str, dry_run: bool) -> None:
    content = INDEX_FILE.read_text()

    # Try both .ts and .js stems
    import_line = None
    for ext in ("ts", "js"):
        candidate = f"import {name} from './{name}.{ext}';" if ext != "ts" else f"import {name} from './{name}';"
        # index.ts imports don't include the extension
        break
    import_line = f"import {name} from './{name}';"

    if import_line not in content:
        # Try with explicit .ts extension just in case
        import_line_ext = f"import {name} from './{name}.ts';"
        if import_line_ext in content:
            import_line = import_line_ext
        else:
            print(f"  [not found] '{name}' not registered in index.ts — skipping.")
            return

    content = content.replace(import_line + "\n", "")
    content = content.replace(f"  {name},\n", "")

    if dry_run:
        print(f"\n--- commands/index.ts (after removal) ---\n{content}")
    else:
        INDEX_FILE.write_text(content)
        print(f"  [updated] src/commands/index.ts")


def remove_command_file(name: str, dry_run: bool) -> None:
    # Accept either .ts or .js
    for ext in (".ts", ".js"):
        f = COMMANDS_DIR / f"{name}{ext}"
        if f.exists():
            if dry_run:
                print(f"  [would delete] src/commands/{f.name}")
            else:
                f.unlink()
                print(f"  [deleted] src/commands/{f.name}")
            return

    print(f"ERROR: src/commands/{name}.ts (or .js) not found.")
    sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Remove a custom terminal command from the portfolio site.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("name",      help="Command name to remove (e.g. ping)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be removed without modifying any files")
    args = parser.parse_args()

    name = args.name.strip()

    if name in PROTECTED:
        print(f"ERROR: '{name}' is a built-in command and cannot be removed.")
        sys.exit(1)

    print(f"\nRemoving command '{name}'" + (" [dry-run]" if args.dry_run else ""))

    remove_command_file(name, args.dry_run)
    remove_from_index(name, args.dry_run)

    if not args.dry_run:
        print(f"\nDone. Run 'npm run lint' to verify.")
    else:
        print(f"\n[dry-run complete] No files were modified.")


if __name__ == "__main__":
    main()
