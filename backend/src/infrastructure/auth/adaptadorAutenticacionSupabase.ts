import { Injectable } from "@nestjs/common";
import { decodeJwt, jwtVerify } from "jose";
import {
  PuertoAutenticacion,
  ResultadoSesionAuth,
  TokenVerificado,
} from "../../application/ports/puertosAplicacion";
import { ErrorNoAutenticado } from "../../domain/errors/errorDominio";
import { FabricaClienteSupabase } from "../supabase/fabricaClienteSupabase";

@Injectable()
export class AdaptadorAutenticacionSupabase implements PuertoAutenticacion {
  constructor(private readonly fabrica: FabricaClienteSupabase) {}

  async iniciarSesion(correo: string, contrasena: string): Promise<ResultadoSesionAuth> {
    const { data, error } = await this.fabrica.crearClienteAnonimo().auth.signInWithPassword({
      email: correo,
      password: contrasena,
    });
    if (error || !data.session || !data.user) {
      throw new ErrorNoAutenticado("Credenciales inválidas");
    }
    return this.mapearSesion(
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in,
      data.user.id,
    );
  }

  async cerrarSesion(tokenAcceso: string): Promise<void> {
    await this.fabrica.crearClienteUsuario(tokenAcceso).auth.signOut();
  }

  async renovarSesion(tokenRenovacion: string): Promise<ResultadoSesionAuth> {
    const { data, error } = await this.fabrica.crearClienteAnonimo().auth.refreshSession({
      refresh_token: tokenRenovacion,
    });
    if (error || !data.session || !data.user) {
      throw new ErrorNoAutenticado("No se pudo renovar la sesión");
    }
    return this.mapearSesion(
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in,
      data.user.id,
    );
  }

  async crearIdentidad(correo: string, contrasena: string, nombreCompleto: string): Promise<string> {
    const { data, error } = await this.fabrica.crearClienteServicio().auth.admin.createUser({
      email: correo,
      password: contrasena,
      email_confirm: true,
      app_metadata: { nombreCompleto },
    });
    if (error || !data.user) {
      throw new ErrorNoAutenticado(error?.message ?? "No se pudo crear la identidad");
    }
    return data.user.id;
  }

  async verificarToken(tokenAcceso: string): Promise<TokenVerificado> {
    try {
      const secreto = new TextEncoder().encode(this.fabrica.obtenerSecretoJwt());
      const { payload } = await jwtVerify(tokenAcceso, secreto, { algorithms: ["HS256"] });
      if (!payload.sub) {
        throw new ErrorNoAutenticado("Token inválido");
      }
      return {
        sub: payload.sub,
        identificadorSesion: typeof payload.session_id === "string" ? payload.session_id : null,
      };
    } catch (error) {
      if (error instanceof ErrorNoAutenticado) {
        throw error;
      }
      throw new ErrorNoAutenticado("Token inválido");
    }
  }

  private mapearSesion(
    tokenAcceso: string,
    tokenRenovacion: string,
    expiraEn: number,
    usuarioAuthId: string,
  ): ResultadoSesionAuth {
    const payload = decodeJwt(tokenAcceso);
    return {
      tokenAcceso,
      tokenRenovacion,
      expiraEn,
      usuarioAuthId,
      identificadorSesion: typeof payload.session_id === "string" ? payload.session_id : null,
    };
  }
}
