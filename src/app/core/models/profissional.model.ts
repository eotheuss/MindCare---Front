import { UsuarioDTO } from './usuario.model';

export interface ProfissionalDTO extends UsuarioDTO {
  tipoProfissional: string;
  registroProfissional: string;
  abordagens?: string[];
  especialidades?: string[];
  modalidades?: string[];
  pacientes?: unknown[];
  consultas?: unknown[];
  clinica?: unknown;
}
