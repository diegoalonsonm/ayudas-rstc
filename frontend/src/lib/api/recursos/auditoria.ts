import { solicitar } from "../clienteServidor";
import type { EventoAuditoria } from "../../dominio/tipos";

export const LIMITE_EVENTOS_BACKEND = 200;

export async function listarEventosAuditoria(): Promise<EventoAuditoria[]> {
  return await solicitar<EventoAuditoria[]>("/eventos-auditoria");
}
