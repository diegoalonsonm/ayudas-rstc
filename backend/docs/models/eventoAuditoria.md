# EventoAuditoria

Tabla particionada, inmutable. Lecturas sensibles se escriben desde la API; escrituras las cubren triggers.

Acciones mínimas: `INICIAR_SESION`, `CERRAR_SESION`, `FALLAR_INICIO_SESION`, `CONSULTAR_EXPEDIENTE`, `BUSCAR_PERSONA`, `CREAR`, `ACTUALIZAR`, `ELIMINAR_LOGICAMENTE`, `RESTAURAR`, `CAMBIAR_ESTADO_SOLICITUD`, `APROBAR_AYUDA`, `RECHAZAR_AYUDA`, `REGISTRAR_ENTREGA`, `CREAR_USUARIO`, `CAMBIAR_ROL`, `CAMBIAR_ALCANCE`, `DESACTIVAR_USUARIO`, `CARGAR_DOCUMENTO`, `VISUALIZAR_DOCUMENTO`, `DESCARGAR_DOCUMENTO`, `EXPORTAR_DATOS`.

JSON de auditoría enmascara documento, teléfono, correo, tokens y claves de objeto.
