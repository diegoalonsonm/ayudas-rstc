#!/usr/bin/env python3
"""Print each per-canton barrio seed SQL to stdout (for piping)."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
seeds = ROOT / "supabase/seeds"
cantons = sys.argv[1:] or sorted(p.stem.replace("cartago_barrios_", "") for p in seeds.glob("cartago_barrios_ca-*.sql"))
for c in cantons:
    path = seeds / f"cartago_barrios_{c}.sql"
    if not path.exists():
        print(f"missing {path}", file=sys.stderr)
        sys.exit(1)
    print(path.read_text(), end="\n\n")
