import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IDS = {
    "CA-02|Paraíso": "60cb6b93-b1bc-4f58-8473-23f83192a2fe",
    "CA-02|Santiago": "db846fbf-7091-4c30-8894-42dbf65c1c1c",
    "CA-02|Orosi": "c7c7f926-23fb-4f8d-b0cf-75cbcb224b6c",
    "CA-02|Cachí": "752c145b-255e-4604-834b-4cbff0ca7b0f",
    "CA-02|Llanos de Santa Lucía": "80c41afa-f19a-4bd7-b038-890ace137555",
    "CA-02|Birrisito": "98e9f096-c0d0-4fd8-964f-8495d5c88a21",
    "CA-03|Tres Ríos": "e1521d69-4219-475e-9840-27224ec6c76f",
    "CA-03|San Diego": "04a0c85c-6ed6-41ac-a3e8-21b5d9dce5b5",
    "CA-03|San Juan": "42d9ace5-4205-46ae-8c4e-eeea995a7f9a",
    "CA-03|San Rafael": "7b77a1fd-3128-480b-875a-2071fb6d04cc",
    "CA-03|Concepción": "a8124955-960a-4771-8894-13175d4110ba",
    "CA-03|Dulce Nombre": "3cc0e605-84c5-4d70-9c5b-20b37ab5ef04",
    "CA-03|San Ramón": "076895ee-167d-43df-ad5b-eed5c08e61c4",
    "CA-03|Río Azul": "3e778eb0-5fb0-4cca-b8f6-8b44282a6ab6",
    "CA-04|Juan Viñas": "6bd3b0a5-b319-4fb1-990f-3b7f96dbbc3e",
    "CA-04|Tucurrique": "272cb757-ffd4-4862-b0a2-479ac1818b43",
    "CA-04|Pejibaye": "62fee0cb-8c3f-448c-909d-1ba57f4caeeb",
    "CA-04|La Victoria": "9970da14-505c-43c3-87cb-9503e6b8a254",
    "CA-05|Turrialba": "466c9774-7827-4a99-8403-aefbbcfe4230",
    "CA-05|La Suiza": "f035529d-80b0-4552-b31e-815b1442c65c",
    "CA-05|Peralta": "bedf908d-0ebc-479d-a594-0cf05a38ad88",
    "CA-05|Santa Cruz": "677d3406-17c9-4d58-b35e-3b8dab632a35",
    "CA-05|Santa Teresita": "e4d7ec31-c214-4d5f-8db4-dca3b57fcb0f",
    "CA-05|Pavones": "fe810925-6ca9-4ec4-9e5c-9d9846873398",
    "CA-05|Tuis": "c770bece-47ad-43ff-bfb6-48877067dae1",
    "CA-05|Tayutic": "80ca0a43-1849-4edf-985d-537d1955bf44",
    "CA-05|Santa Rosa": "94ca3e12-dadb-40fc-b0f1-d60cd391f8da",
    "CA-05|Tres Equis": "c5e5ecca-2f6f-4d95-a195-1535bd16e7c4",
    "CA-05|La Isabel": "b27c106c-3d66-442b-a393-13b69f142a11",
    "CA-05|Chirripó": "9fb53728-266c-4747-ac41-523aeea2f7f6",
    "CA-06|Pacayas": "0e66f4c1-134a-47de-9d01-89093d944f9d",
    "CA-06|Cervantes": "3f89a1c2-2dca-4cd7-b409-c73b971110a2",
    "CA-06|Capellades": "6a0723d7-114b-48ff-a2d4-e7c5f7a22759",
    "CA-07|San Rafael": "f6b065f6-99dd-4592-aa9a-49c0764b81ad",
    "CA-07|Cot": "c4253efe-8d11-42e2-830f-654949c4915e",
    "CA-07|Potrero Cerrado": "818a1091-6d39-4bf1-9b20-f90d44d7498c",
    "CA-07|Cipreses": "245e60d3-d43d-42b6-8aeb-9e3d2a3a7772",
    "CA-07|Santa Rosa": "251315e0-7815-48c0-bd88-5f77016a9601",
    "CA-08|El Tejar": "3273e0b3-cf53-42da-9fb3-ee735a2ba2b7",
    "CA-08|San Isidro": "563cb937-4669-49f9-9ad4-ad27b523d7d2",
    "CA-08|Tobosi": "3e66325c-815e-4625-9e56-2b053d5895a6",
    "CA-08|Patio de Agua": "0335fa2d-45c1-4273-9f08-a9573daa210e",
}

ORDER = sorted(IDS.keys(), key=lambda k: (k.split("|")[0], k.split("|")[1]))


def clean(n: str) -> str:
    n = re.sub(r"\s*\(parte\)\s*", "", n, flags=re.I)
    n = re.sub(r"\s*\([^)]*parte[^)]*\)\s*", "", n, flags=re.I)
    n = n.replace("barrio ", "").replace("Barrio ", "").strip()
    if "Alto Jesús" in n:
        return "Alto Birrisito"
    if n == "el Chiral":
        return "El Chiral"
    if n == "Birrís (este)":
        return "Birrís Este"
    return n.strip()


def main() -> None:
    data = json.loads((ROOT / "tmp_localidades_cartago.json").read_text())
    rows: list[tuple[str, str, str, str]] = []
    for key in ORDER:
        entry = next(x for x in data if x["distrito_key"] == key)
        locs = [clean(x) for x in entry["localidades"]]
        locs = [x for x in locs if x]
        if not locs:
            locs = [key.split("|")[1]]
        did = IDS[key]
        for name in locs:
            rows.append((key.split("|")[0], key, did, name))

    rows.sort(key=lambda r: (r[0], ORDER.index(r[1]), r[3].lower()))

    by_canton: dict[str, list] = {}
    for row in rows:
        by_canton.setdefault(row[0], []).append(row)

    seeds_dir = ROOT / "supabase/seeds"
    seeds_dir.mkdir(parents=True, exist_ok=True)

    for canton in sorted(by_canton.keys()):
        chunk = by_canton[canton]
        vals = []
        for _, _, did, name in chunk:
            esc = name.replace("'", "''")
            vals.append(f"  ('{did}'::uuid, '{esc}')")

        sql = f"""-- Barrios {canton} ({len(chunk)} registros). Numeración global automática.
SET search_path = ayudas_rstc, public;

WITH admin AS (
  SELECT '6bf12564-ed1f-4a20-809d-bf6b23e029ad'::uuid AS usuario_id
),
base AS (
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(codigo FROM 4) AS INTEGER)),
    0
  ) AS offset
  FROM ayudas_rstc.barrios
  WHERE eliminado_en IS NULL AND codigo ~ '^BA-[0-9]+$'
),
datos (distrito_id, nombre) AS (
  VALUES
{",\n".join(vals)}
),
numerados AS (
  SELECT
    d.distrito_id,
    d.nombre,
    'BA-' || lpad(
      (b.offset + row_number() OVER (
        ORDER BY c.codigo, di.codigo, lower(d.nombre)
      ))::text,
      3,
      '0'
    ) AS codigo
  FROM datos d
  JOIN ayudas_rstc.distritos di ON di.id = d.distrito_id
  JOIN ayudas_rstc.cantones c ON c.id = di.canton_id
  CROSS JOIN base b
)
INSERT INTO ayudas_rstc.barrios (distrito_id, codigo, nombre, creado_por_usuario_id)
SELECT n.distrito_id, n.codigo, n.nombre, a.usuario_id
FROM numerados n
CROSS JOIN admin a
WHERE NOT EXISTS (
  SELECT 1 FROM ayudas_rstc.barrios b
  WHERE b.codigo = n.codigo AND b.eliminado_en IS NULL
);
"""
        out = seeds_dir / f"cartago_barrios_{canton.lower()}.sql"
        out.write_text(sql)
        print(f"{canton}: {len(chunk)} -> {out.name}")

    # combined file (legacy)
    all_vals = []
    for _, _, did, name in rows:
        esc = name.replace("'", "''")
        all_vals.append(f"  ('{did}'::uuid, '{esc}')")
    combined = seeds_dir / "cartago_provincia_resto_barrios.sql"
    combined.write_text(
        f"-- Total {len(rows)} barrios CA-02..CA-08. Prefer per-canton seed files.\n"
    )
    print(f"total rows={len(rows)}")


if __name__ == "__main__":
    main()
