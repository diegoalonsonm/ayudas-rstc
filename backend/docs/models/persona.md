# Persona

Tabla: `personas`. Una persona por diócesis.

| Campo API | Columna | Notas |
| --- | --- | --- |
| tipoDocumentoId | tipo_documento_id | Catálogo; puede ser nulo |
| numeroDocumentoCifrado | numero_documento_cifrado | AES-256-GCM en la API |
| numeroDocumentoHash | numero_documento_hash | SHA-256 del documento normalizado; único si activo |
| primerNombre, segundoNombre, primerApellido, segundoApellido | | |
| telefono | telefono | Cifrado en la API |

El documento no es obligatorio (extranjeros, menores, sin documento).

# Direccion

Una `esActual` no eliminada por persona. `senas` es sensible y se enmascara en auditoría.
