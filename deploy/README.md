# Ambiente de desarrollo en el servidor

Frontend (Next.js) y backend (NestJS) se publican con Docker Compose detrás de Caddy. El navegador **solo habla con Next.js** por HTTPS. NestJS y Supabase quedan en la red del servidor.

```text
Cualquier dispositivo
        │  HTTPS (dominio público o Tailscale)
        ▼
     Caddy :80 / :443
        │
        ▼
   Next.js :3100  ──URL_API_BACKEND──►  NestJS :3000
                                              │
                                              ▼
                                    Supabase del host :8000
```

El workflow [`.github/workflows/deploy-dev.yml`](../.github/workflows/deploy-dev.yml) copia el código por Tailscale+SSH y ejecuta `docker compose up`. Las migraciones de la base siguen en [`.github/workflows/supabase-migrations.yml`](../.github/workflows/supabase-migrations.yml); este compose **no** incluye Supabase.

## Qué debe haber en el servidor

| Requisito | Notas |
| --- | --- |
| Docker Engine + Compose v2 | `docker compose version` |
| OpenSSH server + rsync | El CI entra por Tailscale a `:22` |
| Tailscale | El mismo nodo que ya usa el pipeline de migraciones |
| RAM | 4 GB o más; el build de Next.js es pesado |
| Supabase self-hosted | Kong en `:8000`, Postgres en `:5432` (este último solo por Tailscale) |

No instale Node.js en el host para correr la app: vive dentro de los contenedores.

### Supabase desde Docker

El contenedor del backend **no** puede usar `127.0.0.1`: esa dirección es el propio contenedor.

En el `.env` del servidor:

```env
SUPABASE_URL=http://host.docker.internal:8000
```

Use las mismas claves (`ANON`, `SERVICE_ROLE`, `JWT_SECRET`, `DATOS_SENSIBLES_CLAVE`) que ya usa el backend contra esa instancia. No publique Kong ni Postgres a internet.

### Usuario SSH para GitHub Actions

1. Cree un usuario de deploy (ejemplo: `deploy`) y agréguelo al grupo `docker`.
2. Genere un par de claves **solo** para el CI (`ed25519`).
3. Ponga la pública en `~deploy/.ssh/authorized_keys`.
4. Cree el directorio de la app, por ejemplo `/opt/ayudas-rstc`, con dueño `deploy`.
5. El `.env` vive ahí y **no** se versiona. Actions no lo pisa (`rsync` excluye `.env`).

```bash
sudo mkdir -p /opt/ayudas-rstc
sudo chown deploy:deploy /opt/ayudas-rstc
cp deploy/.env.example /opt/ayudas-rstc/.env
# edite /opt/ayudas-rstc/.env con las claves reales
```

### ACL de Tailscale

Si el ACL de `tag:ci` solo permite Postgres `:5432` (el ejemplo restrictivo de [`supabase/README.md`](../supabase/README.md)), el deploy fallará: el runner también necesita **SSH `:22`**.

```json
{
  "action": "accept",
  "src": ["tag:ci"],
  "dst": ["100.127.208.105:5432", "100.127.208.105:22"]
}
```

Sustituya la IP por la de su nodo. Un ACL `dst: ["*:*"]` ya cubre ambos puertos.

## Acceso desde cualquier dispositivo

### Día a día (Tailscale)

Con el dispositivo en la cola, abra `https://$PUBLIC_HOST` si el DNS público resuelve, o el hostname MagicDNS del nodo (`https://<nodo>.<cola>.ts.net`) si configuró [Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) hacia Caddy:

```bash
sudo tailscale serve --bg --https=443 http://127.0.0.1:80
```

Sirve si Caddy redirige 80→443 y el certificado lo termina Tailscale, **o** si `PUBLIC_HOST` es el hostname `ts.net` y Caddy obtiene el certificado. Lo más simple cuando ya hay dominio público: use esa misma URL también desde Tailscale.

### Público (demos sin Tailscale)

1. Registro A/AAAA de `PUBLIC_HOST` a la IP pública del servidor (o del router).
2. Reenvío de los puertos **80** y **443** TCP (y 443 UDP si usa HTTP/3) al host.
3. Caddy pide el certificado Let’s Encrypt con `ACME_EMAIL`.

### Sin dominio todavía: Funnel

[Tailscale Funnel](https://tailscale.com/kb/1223/tailscale-funnel) publica `https://<nodo>.<cola>.ts.net` en internet sin abrir puertos en el router. La URL es de Tailscale, no un dominio propio.

Hace falta habilitar Funnel en la ACL y:

```bash
sudo tailscale funnel --bg --https=443 http://127.0.0.1:80
```

## Variables en `/opt/ayudas-rstc/.env`

Plantilla: [`deploy/.env.example`](.env.example).

| Variable | Uso |
| --- | --- |
| `PUBLIC_HOST` | Hostname que Caddy usa para TLS (dominio o MagicDNS) |
| `ACME_EMAIL` | Contacto de Let’s Encrypt |
| `URL_API_BACKEND` | `http://backend:3000/api/v1` (nombre del servicio Compose) |
| `SUPABASE_URL` | `http://host.docker.internal:8000` |
| `SUPABASE_ANON_KEY` | Anon key de la instancia self-hosted |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role |
| `SUPABASE_JWT_SECRET` | Secreto JWT de Auth |
| `DATOS_SENSIBLES_CLAVE` | Clave AES de 32 bytes (UTF-8 o Base64) |

No publique los puertos 3000 ni 3100. Solo Caddy (80/443) sale al exterior.

## Primera vez (manual)

En el servidor, con el `.env` ya completo y el código en `/opt/ayudas-rstc` (clone o el primer rsync de Actions):

```bash
cd /opt/ayudas-rstc
docker compose -f deploy/docker-compose.yml --env-file .env up -d --build
docker compose -f deploy/docker-compose.yml --env-file .env ps
```

`--env-file .env` es obligatorio: Compose, con `-f deploy/docker-compose.yml`, no carga solo el `.env` de la raíz.

Comprobaciones:

```bash
docker compose -f deploy/docker-compose.yml --env-file .env exec backend \
  node -e "fetch('http://127.0.0.1:3000/api/v1/salud').then((r)=>r.text()).then(console.log)"
```

En el navegador: `https://$PUBLIC_HOST/ingreso`. El login exige HTTPS porque `next start` pone `NODE_ENV=production` y las cookies van con `secure`.

Si el backend no alcanza Supabase: confirme que Kong escucha en `0.0.0.0:8000` (no solo `127.0.0.1`) o que `host.docker.internal` resuelve al host (`docker compose exec backend getent hosts host.docker.internal`).

## GitHub Actions

Se dispara con **push a `dev`** (cambios en `frontend/`, `backend/`, `deploy/` o el workflow) y con **Run workflow** sobre la rama `dev`.

1. Checkout en el runner de GitHub
2. Unión a Tailscale (`tag:ci`), igual que las migraciones
3. `rsync` al servidor (nunca copia `.env`)
4. `docker compose up -d --build` por SSH

### Secretos y variables (environment `development`)

Además de los de migraciones (`TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET`):

| Nombre | Tipo | Valor |
| --- | --- | --- |
| `DEV_SSH_HOST` | secreto | IP Tailscale del servidor (`100.x`), no `localhost` |
| `DEV_SSH_USER` | secreto | Usuario SSH (`deploy`) |
| `DEV_SSH_PRIVATE_KEY` | secreto | Clave privada completa, con saltos de línea |
| `DEV_DEPLOY_PATH` | variable | Ruta en el host; si falta, se usa `/opt/ayudas-rstc` |

Settings → Environments → **development**. El `.env` de la app **no** va a GitHub.

### Fallos frecuentes

| Síntoma | Causa típica |
| --- | --- |
| Timeout SSH tras ping OK | ACL de `tag:ci` no permite `:22` |
| `Permission denied (publickey)` | La pública no está en `authorized_keys`, o el secreto no es la privada emparejada |
| `Falta …/.env en el servidor` | No se creó el archivo a mano; Actions no lo genera |
| Let’s Encrypt falla | El dominio no apunta al servidor, o 80/443 no están reenviados |
| Login no deja cookie | Se está abriendo HTTP en vez de HTTPS |
| Backend no habla con Supabase | `SUPABASE_URL` usa `127.0.0.1`, o Kong no escucha fuera de localhost |
| `ECONNREFUSED 127.0.0.1:22` | `DEV_SSH_HOST` es localhost en vez de la IP Tailscale |

## Fuera de este ambiente

El deploy cloud de producción no está en este compose. No mezcle secretos de producción en `/opt/ayudas-rstc/.env`.
