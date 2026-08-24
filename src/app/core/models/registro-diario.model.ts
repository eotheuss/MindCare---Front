export interface RegistroDiarioDTO {
  paciente?: unknown;
  nivelHumor: string;
  pontosPositivos: string;
  dificuldadesDesafios: string;
  dataHoraCriacao?: string | null;
}
