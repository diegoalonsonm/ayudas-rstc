import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function cargarVariablesEntorno(): void {
  const ruta = resolve(__dirname, "../.env");
  if (!existsSync(ruta)) {
    return;
  }
  for (const linea of readFileSync(ruta, "utf8").split("\n")) {
    const texto = linea.trim();
    if (!texto || texto.startsWith("#")) {
      continue;
    }
    const indice = texto.indexOf("=");
    if (indice < 0) {
      continue;
    }
    const clave = texto.slice(0, indice).trim();
    const valor = texto.slice(indice + 1).trim();
    if (!process.env[clave]) {
      process.env[clave] = valor;
    }
  }
}

async function bootstrapAdministrador(): Promise<void> {
  cargarVariablesEntorno();
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const correo = process.env.ADMIN_CORREO;
  const contrasena = process.env.ADMIN_CONTRASENA;
  const nombre = process.env.ADMIN_NOMBRE ?? "Administrador";

  if (!url || !serviceKey || !correo || !contrasena) {
    throw new Error("Faltan SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_CORREO o ADMIN_CONTRASENA");
  }

  const cliente = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "ayudas_rstc" },
  });

  const { data: creado, error: errorAuth } = await cliente.auth.admin.createUser({
    email: correo,
    password: contrasena,
    email_confirm: true,
    app_metadata: { rol: "ADMINISTRADOR" },
  });
  if (errorAuth || !creado.user) {
    throw new Error(errorAuth?.message ?? "No se pudo crear el usuario de autenticación");
  }

  const { data: rol, error: errorRol } = await cliente
    .from("roles")
    .select("id")
    .eq("codigo", "ADMINISTRADOR")
    .is("eliminado_en", null)
    .single();
  if (errorRol || !rol) {
    throw new Error(errorRol?.message ?? "No existe el rol ADMINISTRADOR");
  }

  const { data: usuario, error: errorUsuario } = await cliente
    .from("usuarios")
    .insert({
      identidad_autenticacion_id: creado.user.id,
      nombre_completo: nombre,
      correo: correo.toLowerCase(),
      activo: true,
    })
    .select("id")
    .single();
  if (errorUsuario || !usuario) {
    throw new Error(errorUsuario?.message ?? "No se pudo insertar el usuario");
  }

  const { error: errorAsignacion } = await cliente.from("asignaciones_usuario").insert({
    usuario_id: usuario.id,
    rol_id: rol.id,
  });
  if (errorAsignacion) {
    throw new Error(errorAsignacion.message);
  }

  process.stdout.write(`Administrador creado: ${usuario.id}\n`);
}

bootstrapAdministrador().catch((error: Error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
