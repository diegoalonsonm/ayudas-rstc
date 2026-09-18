import { Controller, Get } from "@nestjs/common";
import { RutaPublica } from "../decorators/decoradoresHttp";

@Controller("salud")
export class SaludController {
  @Get()
  @RutaPublica()
  verificar() {
    return { estado: "ok" };
  }
}
