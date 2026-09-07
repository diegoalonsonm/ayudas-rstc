# Backend — Sistema de Ayudas RSTC

API REST en NestJS con Clean Architecture. Consume el schema `ayudas_rstc` de Supabase (migraciones en `/supabase`). No modifica el esquema.

## Requisitos

- Node.js 20 o superior
- Docker (para Supabase local)
- [CLI de Supabase](https://supabase.com/docs/guides/local-development)

## Entornos

| Entorno | Base de datos |
| --- | --- |
| Desarrollo | Instancia local (`supabase start`) en `http://127.0.0.1:54321` |
| Producción | Proyecto cloud de la organización |

El cliente usa `db.schema = ayudas_rstc`. En cloud hay que exponer ese schema en Settings → API.

## Arranque local

Desde la raíz del repositorio:

```bash
supabase start
```

Anote las claves que imprime `supabase status` (`anon key`, `service_role key`, `JWT secret`).

En `backend/`:

```bash
cp .env.example .env
```

Complete `.env`:

```env
PORT=3000
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
SUPABASE_JWT_SECRET=<JWT secret>
DATOS_SENSIBLES_CLAVE=<32 bytes en UTF-8 o Base64 de 32 bytes>
```

```bash
npm install
npm run start:dev
```

La API queda en `http://localhost:3000/api/v1`. En Postman, Insomnia o similar: `GET {{baseUrl}}/salud` con `baseUrl=http://localhost:3000/api/v1`.

## Primer administrador

El seed local crea diócesis, vicarías y parroquias de ejemplo, no usuarios. Con Supabase ya arrancado y `.env` cargado:

```bash
ADMIN_CORREO=admin@local.test ADMIN_CONTRASENA=Cambiar1234 ADMIN_NOMBRE="Administrador" npm run bootstrap:administrador
```

El script crea la identidad en Auth, el registro en `usuarios` y una asignación `ADMINISTRADOR`.

## Autenticación

Las rutas públicas son:

- `GET /api/v1/salud`
- `POST /api/v1/auth/sesiones`
- `POST /api/v1/auth/sesiones/renovacion`

El resto exige `Authorization: Bearer <access_token>` de Supabase Auth. El backend verifica el JWT, carga el usuario y su asignación vigente, y aplica rol y alcance. Las consultas a Postgres van con el JWT del usuario para que RLS refuerce las mismas reglas.

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run start:dev` | API en modo watch |
| `npm run build` | Compila a `dist/` |
| `npm start` | Arranque compilado |
| `npm test` | Tests unitarios (Jest) |
| `npm run bootstrap:administrador` | Alta del primer ADMINISTRADOR |

## Documentación

- Endpoints para Postman / Insomnia / Bruno: [`docs/endpoints`](docs/endpoints) (empiece por [`docs/endpoints/README.md`](docs/endpoints/README.md))
- Modelos de dominio: [`docs/models`](docs/models)

## Arquitectura

```
src/domain          entidades, reglas, contratos (sin Nest ni Supabase)
src/application     casos de uso y puertos
src/infrastructure  Supabase, JWT, cifrado, repositorios
src/presentation    controllers, guards, filtros HTTP
```

Nombres en camelCase. Sin comentarios en el código. El borrado es lógico (`eliminadoEn` + `motivoEliminacion`).
