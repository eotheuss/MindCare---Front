import { RegistroDiarioDTO } from './registro-diario.model';

export interface RelatorioSemanalDTO {
  paciente?: unknown;
  faixaDeDatas: string;
  registrosDiarios: RegistroDiarioDTO[];
  observacoes: string;
  recomendacoes: string;
  relatorioIA: string;
  dataHoraCriacao?: string | null;
  totalPositivos: number;
  totalNegativos: number;
  resumo: string;
}
