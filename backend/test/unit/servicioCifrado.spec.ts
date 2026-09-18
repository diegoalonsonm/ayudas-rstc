import { randomBytes } from "crypto";
import { ServicioCifrado } from "../../src/domain/services/servicioCifrado";
import { ServicioEnmascarado } from "../../src/domain/services/servicioEnmascarado";

describe("ServicioCifrado", () => {
  const servicio = new ServicioCifrado(randomBytes(32));

  it("normaliza y calcula hash estable del documento", () => {
    const a = servicio.calcularHashDocumento("1-234-567");
    const b = servicio.calcularHashDocumento("1234567");
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });

  it("cifra y descifra documento y teléfono", () => {
    const cifrado = servicio.cifrar("88881111");
    expect(cifrado).not.toBe("88881111");
    expect(servicio.descifrar(cifrado)).toBe("88881111");
  });
});

describe("ServicioEnmascarado", () => {
  it("redacta campos sensibles", () => {
    const resultado = new ServicioEnmascarado().enmascarar({
      primerNombre: "Ana",
      telefono: "8888",
      numeroDocumentoCifrado: "abc",
    });
    expect(resultado?.primerNombre).toBe("Ana");
    expect(resultado?.telefono).toBe("[redactado]");
    expect(resultado?.numeroDocumentoCifrado).toBe("[redactado]");
  });
});
