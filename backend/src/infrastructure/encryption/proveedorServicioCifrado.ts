import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ServicioCifrado } from "../../domain/services/servicioCifrado";

@Injectable()
export class ProveedorServicioCifrado extends ServicioCifrado {
  constructor(config: ConfigService) {
    const clave = config.getOrThrow<string>("DATOS_SENSIBLES_CLAVE");
    const buffer = Buffer.from(clave, "base64").length === 32
      ? Buffer.from(clave, "base64")
      : Buffer.from(clave, "utf8");
    super(buffer);
  }
}
