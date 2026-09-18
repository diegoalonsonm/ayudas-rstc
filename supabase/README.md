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

El workflow está en `.github/workflows/supabase-migrations.yml`. Mientras el PR está abierto se valida el SQL; las migraciones contra el servidor de desarrollo se aplican **solo cuando el PR a `dev` se mergea** (PR completed).

| Git | Destino | Cómo se indica el servidor |
| --- | --- | --- |
| PR a `dev` mergeado | Instancia de desarrollo (IP Tailscale) | `DEV_DATABASE_URL` + OAuth Tailscale |
| Push a `main` | Proyecto cloud de la organización | `PRODUCTION_PROJECT_ID` + password + token |

El runner de GitHub no está en tu red. Tu servidor de desarrollo se alcanza por **Tailscale** (`100.x`), así que el job se une a la cola, comprueba que el host responde (`ping`) y recién entonces corre `supabase db push`.

```text
GitHub runner (ubuntu-latest)
        │  1. OAuth → auth key efímera (tag:ci)
        ▼
  Tailscale (nodo temporal del CI)
        │  2. ping a 100.127.208.105
        ▼
  Servidor Supabase (ya en la cola)
        │  3. Postgres en :5432  (no Kong :8000)
        ▼
  db push de migraciones pendientes
```

`DEV_DATABASE_URL` usa la IP Tailscale y el puerto de **Postgres**:

```text
postgresql://postgres:POSTGRES_PASSWORD@100.127.208.105:5432/postgres
```

| Qué | Puerto | Protocolo |
| --- | --- | --- |
| API / Studio (Kong) | `8000` | HTTP (`…/rest/v1/`) — **no** sirve para migraciones |
| Postgres | `5432` | `postgresql://` — lo que usa `db push` |

No uses `127.0.0.1` ni `localhost` (eso es el runner o el propio servidor visto desde sí mismo).

### 1. Tag `tag:ci` en la ACL de Tailscale

En [Access controls](https://login.tailscale.com/admin/acls) hace falta un tag que el OAuth client pueda asignar al nodo del CI. Ejemplo mínimo (ajusta owners a tu usuario o a un grupo):

```json
{
  "tagOwners": {
    "tag:ci": ["autogroup:admin"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:ci"],
      "dst": ["*:*"]
    }
  ]
}
```

Más restrictivo (Postgres y SSH en el servidor de dev; SSH hace falta para publicar frontend/backend):

```json
{
  "action": "accept",
  "src": ["tag:ci"],
  "dst": ["100.127.208.105:5432", "100.127.208.105:22"]
}
```

Guarda la ACL. Sin `tagOwners` para `tag:ci`, la Action falla con *requested tags are invalid or not permitted*.

### 2. OAuth client

Hace falta rol Owner, Admin, Network admin o IT admin.

1. Abre [Trust credentials](https://console.tailscale.com/admin/settings/trust-credentials).
2. **Credential** → **OAuth**.
3. Scope **`auth_keys`** en **Write** (crear claves para registrar el runner).
4. Asigna el tag **`tag:ci`** a ese scope (obligatorio: un OAuth client no es un usuario, solo puede crear nodos etiquetados).
5. **Generate credential**. Copia **Client ID** y **Client secret** (el secret no se vuelve a mostrar).

Documentación: [OAuth clients](https://tailscale.com/kb/1215/oauth-clients).

### 3. Secretos en GitHub

Environment **`development`** (Settings → Environments):

| Secreto | Valor |
| --- | --- |
| `DEV_DATABASE_URL` | `postgresql://postgres:POSTGRES_PASSWORD@100.127.208.105:5432/postgres` |
| `TS_OAUTH_CLIENT_ID` | Client ID del paso 2 |
| `TS_OAUTH_SECRET` | Client secret del paso 2 |

`POSTGRES_PASSWORD` es la del `.env` de self-hosted, **no** `DASHBOARD_PASSWORD`.

### 4. Postgres visible por Tailscale

Kong en `:8000` por Tailscale no implica que Postgres esté abierto. En el servidor:

```bash
ss -lntp | grep 5432
# o: docker compose ps
```

El mapeo tiene que ser `0.0.0.0:5432` (o la IP Tailscale), no solo `127.0.0.1:5432`. Si Postgres solo escucha en localhost, el ping de Tailscale al host puede pasar y `db push` igual falla.

### Qué hace el job

La Action [tailscale/github-action@v4](https://github.com/tailscale/github-action) usa el OAuth client para mintir una auth key, une un **nodo efímero** con `tag:ci`, hace `ping` al host de `DEV_DATABASE_URL` (hasta ~3 minutos, por consistencia de la cola) y al terminar el job **cierra sesión y Tailscale borra el nodo**.

### Fallos frecuentes

| Síntoma | Causa típica |
| --- | --- |
| `ECONNREFUSED 127.0.0.1:5432` | La URL del secreto usa localhost |
| `requested tags [tag:ci] are invalid` | Falta `tag:ci` en ACL o el OAuth client no tiene ese tag |
| Ping timeout a `100.x` | El servidor no está online en Tailscale, o ACL bloquea `tag:ci` |
| Ping OK, `db push` refused en `:5432` | Postgres no publica `5432` en la interfaz Tailscale |
| Auth OAuth | Secret mal copiado, o scope `auth_keys` en solo lectura |

### Secretos de GitHub (todos los environments)

**Settings → Secrets and variables → Actions**, o en `development` / `production`:

| Secreto | Ambiente | Valor |
| --- | --- | --- |
| `DEV_DATABASE_URL` | `development` | `postgresql://postgres:clave@IP_TAILSCALE:5432/postgres` |
| `TS_OAUTH_CLIENT_ID` | `development` | OAuth client de Tailscale (scope `auth_keys` de escritura, tag `tag:ci`) |
| `TS_OAUTH_SECRET` | `development` | Secret de ese OAuth client |
| `SUPABASE_ACCESS_TOKEN` | `production` | [Access token](https://supabase.com/dashboard/account/tokens) de la CLI |
| `PRODUCTION_PROJECT_ID` | `production` | Ref del proyecto (`https://supabase.com/dashboard/project/<ref>`) |
| `PRODUCTION_DB_PASSWORD` | `production` | Contraseña de la base del proyecto cloud |

No uses `seed.sql` en producción: `db push` no lo aplica. En desarrollo, el seed solo corre con `db reset` en esa instancia, no con este pipeline.

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
