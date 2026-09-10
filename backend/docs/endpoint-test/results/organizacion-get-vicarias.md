# organizacion-get-vicarias

- verdict: **succeeded**
- timestamp: 2026-09-10T17:30:36.246Z
- durationMs: 32

## Assertions

- pass: HTTP 200 matches expected 200

## Request

```http
GET http://localhost:3000/api/v1/vicarias
Authorization: Bearer [REDACTED]
```

## Response

```http
HTTP 200
connection: keep-alive
content-length: 1856
content-type: application/json; charset=utf-8
date: Thu, 10 Sep 2026 17:30:36 GMT
etag: W/"740-GqkFv2ATPAi+ww8o83o7nSNQbFg"
keep-alive: timeout=5
x-powered-by: Express

[{"id":"ce05d2a2-5fa8-4322-91e7-31248c9cbe2e","diocesisId":"ea083179-dd5b-40e5-91b7-763db583e219","nombre":"Vicaría Central","codigo":"D01-V01","creadoEn":"2026-09-08T14:53:32.388544+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T14:53:32.388544+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"0a8974bf-89e9-4f0b-8557-89170d651572","diocesisId":"ea083179-dd5b-40e5-91b7-763db583e219","nombre":"Vicaría Guarco","codigo":"D01-V02","creadoEn":"2026-09-08T14:53:43.937+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T14:53:43.937+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"5ca52573-99b4-4260-b1f8-3cfc1c6285a6","diocesisId":"ea083179-dd5b-40e5-91b7-763db583e219","nombre":"Vicaría Ujarrás","codigo":"D01-V03","creadoEn":"2026-09-08T14:53:55.908857+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T14:53:55.908857+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"63f63379-807a-46a8-9024-edc969538414","diocesisId":"ea083179-dd5b-40e5-91b7-763db583e219","nombre":"Vicaría Turrialba","codigo":"D01-V04","creadoEn":"2026-09-08T14:54:06.844396+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T14:54:06.844396+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null},{"id":"238399a9-b145-4fe0-a46f-e8575106df39","diocesisId":"ea083179-dd5b-40e5-91b7-763db583e219","nombre":"Vicaría Irazú","codigo":"D01-V05","creadoEn":"2026-09-08T14:54:18.374226+00:00","creadoPorUsuarioId":null,"actualizadoEn":"2026-09-08T14:54:18.374226+00:00","actualizadoPorUsuarioId":null,"eliminadoEn":null,"eliminadoPorUsuarioId":null,"motivoEliminacion":null}]
```

