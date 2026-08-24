import { ConsultaDTO } from './consulta.model';
import { PacienteDTO } from './paciente.model';
import { ProfissionalDTO } from './profissional.model';

export interface ClinicaDTO {
  id?: number;
  nome: string;
  cnpj: string;
  endereco: string;
  profissionais: ProfissionalDTO[];
  pacientes: PacienteDTO[];
  consultas: ConsultaDTO[];
  taxaComissao: number;
  planoAssinatura: string;
}
