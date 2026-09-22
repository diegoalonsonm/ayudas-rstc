#!/usr/bin/env python3
"""Apply per-canton barrio seed SQL files via psycopg2 (local or DEV_DATABASE_URL)."""
from __future__ import annotations

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEEDS = ROOT / "supabase/seeds"


def get_dsn() -> str:
    for key in ("DEV_DATABASE_URL", "DATABASE_URL", "SUPABASE_DB_URL"):
        val = os.environ.get(key)
        if val:
            return val
    raise SystemExit(
        "Set DEV_DATABASE_URL (postgresql://...) to apply seeds, e.g. Tailscale dev Postgres."
    )


def main() -> None:
    try:
        import psycopg2
    except ImportError:
        raise SystemExit("pip install psycopg2-binary")

    dsn = get_dsn()
    files = sorted(SEEDS.glob("cartago_barrios_ca-*.sql"))
    if not files:
        raise SystemExit("No seed files found; run generate_resto_barrios_sql.py first.")

    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cur = conn.cursor()
    for path in files:
        sql = path.read_text()
        print(f"Applying {path.name} ...", flush=True)
        cur.execute(sql)
        print(f"  OK ({cur.statusmessage})", flush=True)
    cur.close()
    conn.close()
    print("Done.")

if __name__ == "__main__":
    main()
