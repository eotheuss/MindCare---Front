import { UsuarioDTO } from './usuario.model';

export interface PacienteDTO extends UsuarioDTO {
  estadoPaciente?: string;
  profissionais?: unknown[];
  clinicas?: unknown[];
  consultas?: unknown[];
  prescricoes?: unknown[];
}
