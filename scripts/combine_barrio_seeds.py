from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
seeds = ROOT / "supabase/seeds"
out = ROOT / "supabase/seeds/cartago_provincia_resto_barrios.sql"
parts = [f.read_text() for f in sorted(seeds.glob("cartago_barrios_ca-*.sql"))]
out.write_text("\n\n".join(parts))
print(f"Wrote {out} ({len(out.read_text())} bytes)")
