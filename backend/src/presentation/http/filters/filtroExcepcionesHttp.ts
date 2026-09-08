import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import { ErrorDominio } from "../../../domain/errors/errorDominio";

@Catch()
export class FiltroExcepcionesHttp implements ExceptionFilter {
  private readonly logger = new Logger(FiltroExcepcionesHttp.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof ErrorDominio) {
      response.status(exception.estadoHttp).json({
        codigo: exception.codigo,
        mensaje: exception.message,
      });
      return;
    }
    if (exception instanceof HttpException) {
      const estado = exception.getStatus();
      const cuerpo = exception.getResponse();
      response.status(estado).json(
        typeof cuerpo === "string"
          ? { codigo: "HTTP", mensaje: cuerpo }
          : { codigo: "HTTP", mensaje: (cuerpo as { message?: string }).message ?? exception.message },
      );
      return;
    }
    this.logger.error(
      exception instanceof Error ? exception.stack ?? exception.message : String(exception),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      codigo: "INTERNO",
      mensaje: "Error interno",
    });
  }
}
