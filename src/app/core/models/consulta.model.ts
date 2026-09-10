import { PacienteDTO } from './paciente.model';
import { ProfissionalDTO } from './profissional.model';

export interface ConsultaDTO {
  number?: string;
  profissional?: Partial<ProfissionalDTO>;
  paciente?: Partial<PacienteDTO>;
  clinica?: unknown;
  valorConsulta: number;
  consultaModalidade?: string;
  dataHoraConsulta: string;
  atendida: boolean;
  cancelada: boolean;
}
