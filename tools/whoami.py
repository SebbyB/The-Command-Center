#!/usr/bin/env python3
"""
whoami.py — Update the content displayed by the `whoami` terminal command.

USAGE
    python tools/whoami.py [options] "Line 1" "Line 2" ...
    python tools/whoami.py --file whoami.txt [options]

ARGUMENTS
    lines           One or more strings to display when `whoami` is run.
                    Each becomes a separate addLine() call.

OPTIONS
    --file PATH     Read lines from a plain-text file (one line per row).
                    Blank lines are preserved as empty addLine('') calls.
    --description   Update the command description shown in `help`.
    --dry-run       Print the resulting file without writing it.

EXAMPLES
    python tools/whoami.py "Seb — Full-Stack Developer" "seb@example.com"
    python tools/whoami.py --file whoami.txt --dry-run
    python tools/whoami.py --description "Show who I am" "Hi, I'm Seb."
"""

import argparse
import re
import sys
from pathlib import Path

ROOT        = Path(__file__).parent.parent
WHOAMI_FILE = ROOT / "src" / "commands" / "whoami.ts"


def ts_string(s: str) -> str:
    """Escape and quote a string for use in a TypeScript addLine() call."""
    escaped = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{escaped}'"


def build_execute_body(lines: list[str]) -> str:
    calls = "\n".join(f"    addLine({ts_string(line)});" for line in lines)
    return f"  execute: ({{ addLine }}) => {{\n{calls}\n  }},"


def update_whoami(lines: list[str], description: str | None, dry_run: bool) -> None:
    if not WHOAMI_FILE.exists():
        print(f"ERROR: file not found: {WHOAMI_FILE}")
        sys.exit(1)

    content = WHOAMI_FILE.read_text()

    # Replace the execute block
    new_execute = build_execute_body(lines)
    content, n = re.subn(
        r"  execute: \([^)]*\) => \{[^}]*\},",
        new_execute,
        content,
        flags=re.DOTALL,
    )
    if n == 0:
        print("ERROR: could not locate the execute block in whoami.ts")
        print("       The file may have been manually edited into an unexpected shape.")
        sys.exit(1)

    # Optionally replace the description
    if description is not None:
        escaped_desc = description.replace("'", "\\'")
        content, nd = re.subn(
            r"(  description: ')[^']*(',)",
            rf"\g<1>{escaped_desc}\g<2>",
            content,
        )
        if nd == 0:
            print("WARNING: could not update description field — skipping.")

    if dry_run:
        print(f"--- src/commands/whoami.ts (preview) ---\n{content}")
    else:
        WHOAMI_FILE.write_text(content)
        print(f"  [updated] src/commands/whoami.ts")
        print(f"\nDone. Run 'npm run lint' to verify.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Update the content displayed by the whoami terminal command.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "lines",
        nargs="*",
        metavar="LINE",
        help="Lines of text to display (one per addLine call).",
    )
    parser.add_argument(
        "--file",
        metavar="PATH",
        help="Read lines from a plain-text file instead of positional args.",
    )
    parser.add_argument(
        "--description",
        metavar="TEXT",
        help="New description shown in the help command.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the resulting file without writing it.",
    )
    args = parser.parse_args()

    if args.file and args.lines:
        print("ERROR: provide either positional LINE arguments or --file, not both.")
        sys.exit(1)

    if args.file:
        p = Path(args.file)
        if not p.exists():
            print(f"ERROR: file not found: {p}")
            sys.exit(1)
        lines = p.read_text().splitlines()
    elif args.lines:
        lines = args.lines
    else:
        parser.print_help()
        sys.exit(1)

    print(f"\nUpdating whoami with {len(lines)} line(s):")
    for line in lines:
        print(f"  {line!r}")

    update_whoami(lines, args.description, args.dry_run)


if __name__ == "__main__":
    main()
