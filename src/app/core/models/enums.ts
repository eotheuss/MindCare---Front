export enum PlanoAssinatura {
  BASICO = 'BASICO',
  PROFISSIONAL = 'PROFISSIONAL',
  CLINICA = 'CLINICA',
}

export const PLANOS_ASSINATURA: { valor: PlanoAssinatura; label: string; descricao: string }[] = [
  {
    valor: PlanoAssinatura.BASICO,
    label: 'Básico',
    descricao: 'Ideal para clínicas pequenas iniciando na plataforma.',
  },
  {
    valor: PlanoAssinatura.PROFISSIONAL,
    label: 'Profissional',
    descricao: 'Para clínicas em crescimento, com mais profissionais ativos.',
  },
  {
    valor: PlanoAssinatura.CLINICA,
    label: 'Clínica',
    descricao: 'Estrutura completa multi-unidade, com menor taxa de comissão.',
  },
];

export enum UserRole {
  PACIENTE = 'PACIENTE',
  PROFISSIONAL = 'PROFISSIONAL',
  ADMIN = 'ADMIN',
}

export enum TipoProfissional {
  PSICOLOGO = 'PSICOLOGO',
  PSIQUIATRA = 'PSIQUIATRA',
}

export const TIPOS_PROFISSIONAL: { valor: TipoProfissional; label: string }[] = [
  { valor: TipoProfissional.PSICOLOGO, label: 'Psicólogo(a)' },
  { valor: TipoProfissional.PSIQUIATRA, label: 'Psiquiatra' },
];

export enum Sexo {
  FEMININO = 'FEMININO',
  MASCULINO = 'MASCULINO',
}

export enum EstadoPaciente {
  ESTAVEL = 'ESTAVEL',
  ATENCAO = 'ATENCAO',
  MELHORANDO = 'MELHORANDO',
}

export enum NivelHumor {
  OTIMO = 'OTIMO',
  BOM = 'BOM',
  NEUTRO = 'NEUTRO',
  MAL = 'MAL',
  PESSIMO = 'PESSIMO',
  SEM_DEFINICAO = 'SEM_DEFINICAO',
}

export const MOOD_CONFIG: { valor: NivelHumor; emoji: string; label: string; color: string }[] = [
  { valor: NivelHumor.OTIMO, emoji: '😄', label: 'Ótimo', color: '#4caf50' },
  { valor: NivelHumor.BOM, emoji: '🙂', label: 'Bom', color: '#8bc34a' },
  { valor: NivelHumor.NEUTRO, emoji: '😐', label: 'Neutro', color: '#ffc107' },
  { valor: NivelHumor.MAL, emoji: '😔', label: 'Ruim', color: '#ff9800' },
  { valor: NivelHumor.PESSIMO, emoji: '😢', label: 'Péssimo', color: '#f44336' },
];

export function moodConfigFor(valor: string | undefined | null) {
  return MOOD_CONFIG.find((m) => m.valor === valor) ?? { valor: NivelHumor.SEM_DEFINICAO, emoji: '📝', label: 'Sem registro', color: '#9e9e9e' };
}
