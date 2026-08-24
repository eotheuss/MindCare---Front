export interface ConsultaDTO {
  id?: number;
  profissional?: unknown;
  paciente?: unknown;
  clinica?: unknown;
  valorConsulta: number;
  dataHoraConsulta: string;
  atendida: boolean;
  cancelada: boolean;
}
