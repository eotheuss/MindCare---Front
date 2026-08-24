import { ProfissionalDTO } from './profissional.model';

export interface PrescriptionDocumentDTO {
  nomeArquivo: string;
  contentType: string;
  tamanhoBytes: number;
  criadoEm?: string | null;
}

export interface PrescriptionDTO {
  number: string;
  issueDate: string;
  expirationDate: string;
  daysRemaining: number;
  profissional: ProfissionalDTO;
  medicines: string[];
  controlled: boolean;
  valid: boolean;
  prescriptionDocument?: PrescriptionDocumentDTO;
}
