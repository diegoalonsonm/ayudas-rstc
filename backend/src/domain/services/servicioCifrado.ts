import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { ErrorValidacion } from "../errors/errorDominio";

export class ServicioCifrado {
  constructor(private readonly clave: Buffer) {
    if (clave.length !== 32) {
      throw new ErrorValidacion("DATOS_SENSIBLES_CLAVE debe tener 32 bytes");
    }
  }

  normalizarDocumento(numero: string): string {
    return numero.trim().toUpperCase().replace(/[\s-]/g, "");
  }

  calcularHashDocumento(numero: string): string {
    return createHash("sha256")
      .update(this.normalizarDocumento(numero), "utf8")
      .digest("hex");
  }

  cifrar(texto: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.clave, iv);
    const cifrado = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, cifrado]).toString("base64");
  }

  descifrar(valor: string): string {
    const buf = Buffer.from(valor, "base64");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const datos = buf.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", this.clave, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(datos), decipher.final()]).toString("utf8");
  }
}
