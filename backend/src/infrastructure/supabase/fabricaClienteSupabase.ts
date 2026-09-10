import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";

const SCHEMA = "ayudas_rstc";

@Injectable()
export class FabricaClienteSupabase {
  constructor(private readonly config: ConfigService) {}

  obtenerUrl(): string {
    return this.config.getOrThrow<string>("SUPABASE_URL");
  }

  obtenerClaveAnonima(): string {
    return this.config.getOrThrow<string>("SUPABASE_ANON_KEY");
  }

  obtenerClaveServicio(): string {
    return this.config.getOrThrow<string>("SUPABASE_SERVICE_ROLE_KEY");
  }

  obtenerSecretoJwt(): string {
    return this.config.getOrThrow<string>("SUPABASE_JWT_SECRET");
  }

  crearClienteAnonimo() {
    return createClient(this.obtenerUrl(), this.obtenerClaveAnonima(), {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: SCHEMA },
    });
  }

  crearClienteUsuario(tokenAcceso: string) {
    return createClient(this.obtenerUrl(), this.obtenerClaveAnonima(), {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: SCHEMA },
      global: {
        headers: {
          Authorization: `Bearer ${tokenAcceso}`,
        },
      },
    });
  }

  crearClienteServicio() {
    return createClient(this.obtenerUrl(), this.obtenerClaveServicio(), {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: SCHEMA },
    });
  }
}
