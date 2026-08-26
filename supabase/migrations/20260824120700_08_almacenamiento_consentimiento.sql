-- =============================================================================
-- 08. Bucket privado para documentos de consentimiento informado
-- Se identifica el archivo por bucket + clave_objeto; nunca por URL pública.
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos-consentimiento',
  'documentos-consentimiento',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Convención de ruta: {solicitud_ayuda_id}/{nombre_objeto}
CREATE POLICY sel_consentimiento_storage ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documentos-consentimiento'
    AND ayudas_rstc.solicitud_en_alcance((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY ins_consentimiento_storage ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documentos-consentimiento'
    AND ayudas_rstc.solicitud_en_alcance((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY upd_consentimiento_storage ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documentos-consentimiento'
    AND ayudas_rstc.solicitud_en_alcance((storage.foldername(name))[1]::uuid)
  )
  WITH CHECK (
    bucket_id = 'documentos-consentimiento'
    AND ayudas_rstc.solicitud_en_alcance((storage.foldername(name))[1]::uuid)
  );

-- Sin DELETE: el borrado lógico es del registro; la retención del archivo es independiente.
