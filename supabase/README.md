# Base de datos (Supabase)

Scripts listos para **desarrollo local** y para **producción** mediante el pipeline de migraciones de la CLI de Supabase.

## Qué se ejecuta dónde

| Ruta | Entorno | Contenido |
| --- | --- | --- |
| `migrations/*.sql` | Local **y** producción | Esquema, funciones, RLS, catálogos institucionales |
| `seed.sql` | Solo local (`start` / `db reset`) | Datos de ejemplo (diócesis, vicarías, parroquias) |

`seed.sql` **no** se aplica con `supabase db push`. No ponga ahí catálogos ni cambios de esquema.

El dominio está en el schema **`ayudas_rstc`**, no en `public`. La API local lo expone como schema por defecto (`config.toml`). En cloud hay que añadir `ayudas_rstc` a *Exposed schemas* en Settings → API. El cliente JS debe usar `db: { schema: 'ayudas_rstc' }`.

Tras aplicar migraciones en una instancia que ya estaba corriendo:

```bash
supabase db reset
```

## Desarrollo local

```bash
# Una vez: instalar CLI y Docker
# https://supabase.com/docs/guides/local-development

supabase start
# o, para recrear la base desde cero:
supabase db reset
```

Las migraciones se aplican en orden lexicográfico del nombre de archivo. Studio queda en `http://localhost:54323`.

## Pipeline por branch (`dev` vs `main`)

GitHub Actions **no puede escribir** en el Docker de tu laptop. El mapa de ambientes es este:

| Git | Base de datos | Qué hace el workflow |
| --- | --- | --- |
| Trabajo diario + branch `dev` | Instancia **local** (`supabase start`) | En CI se levanta un Postgres local y se aplican las migraciones para validar que el SQL corre |
| Branch `main` | Proyecto **cloud** de la organización | Tras validar, `supabase db push` aplica solo las migraciones pendientes en producción |

El workflow está en `.github/workflows/supabase-migrations.yml`.

### Secretos de GitHub (producción)

En el repositorio: **Settings → Secrets and variables → Actions**. Si usas el environment `production` (recomendado, con aprobación manual), define los secretos ahí:

| Secreto | Valor |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | [Access token](https://supabase.com/dashboard/account/tokens) de la CLI (cuenta con acceso a la org) |
| `PRODUCTION_PROJECT_ID` | Ref del proyecto (`https://supabase.com/dashboard/project/<ref>`) |
| `PRODUCTION_DB_PASSWORD` | Contraseña de la base del proyecto cloud |

No uses `seed.sql` en producción: `db push` no lo aplica.

### En tu máquina (ambiente de desarrollo)

```bash
git checkout dev
supabase start
# o, si ya estaba corriendo y hay migraciones nuevas:
supabase db reset
```

### Producción (manual, solo si hace falta)

1. No editar una migración ya aplicada en ningún ambiente. Todo cambio nuevo va en un archivo **nuevo** con timestamp posterior.
2. Tras autenticar la CLI:

```bash
supabase link --project-ref "$PRODUCTION_PROJECT_ID"
supabase db push --dry-run
supabase db push
```

`db push` aplica solo las migraciones pendientes en el remoto.

Para revisar el SQL localmente antes de empujar:

```bash
supabase db lint
supabase db diff
```

## Convención de nombres de migración

```text
YYYYMMDDHHMMSS_descripcion_corta.sql
```

Ejemplo: `20260824120700_08_almacenamiento_consentimiento.sql`

## Notas de operación

- El borrado es lógico (`eliminado_en`). No hay `DELETE` concedido a `anon` ni `authenticated`.
- `eventos_auditoria` e `historial_estados_solicitud` son de solo inserción.
- La regla de no superponer tipos de ayuda vigentes se exige en base de datos (bloqueo transaccional + función).
- El bucket `documentos-consentimiento` es privado; se guarda `clave_objeto`, no una URL pública.
