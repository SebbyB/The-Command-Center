#!/usr/bin/env python3
"""
tree.py — Display the virtual filesystem structure.

Shows all sections and pages currently wired into the portfolio site.

USAGE
    python tools/tree.py
"""

from _lib import print_tree


def main() -> None:
    print_tree()


if __name__ == "__main__":
    main()
