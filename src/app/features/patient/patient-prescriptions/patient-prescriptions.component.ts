import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  LucideAngularModule,
  Calendar,
  Pill,
  ShieldAlert,
  User,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { PrescriptionDTO } from '../../../core/models/prescription.model';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

type StatusReceita = 'valid' | 'expiring' | 'expired';

const STATUS_CONFIG: Record<StatusReceita, { label: string; icon: any }> = {
  valid: { label: 'Válida', icon: CheckCircle2 },
  expiring: { label: 'A vencer', icon: Clock },
  expired: { label: 'Vencida', icon: AlertCircle },
};

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavComponent],
  templateUrl: './patient-prescriptions.component.html',
  styleUrl: './patient-prescriptions.component.scss',
})
export class PatientPrescriptionsComponent implements OnInit {
  readonly icons = { Calendar, Pill, ShieldAlert, User, Download, CheckCircle2, Clock, AlertCircle };

  readonly prescricoes = signal<PrescriptionDTO[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly baixando = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private pacienteService: PacienteService,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.pacienteService.listarPrescricoes(nomeUsuario).subscribe({
      next: (prescricoes) => {
        this.prescricoes.set(prescricoes);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar suas receitas.');
        this.carregando.set(false);
      },
    });
  }

  get validCount(): number {
    return this.prescricoes().filter((p) => this.status(p) === 'valid').length;
  }

  status(prescricao: PrescriptionDTO): StatusReceita {
    const hoje = new Date();
    const vencimento = new Date(prescricao.expirationDate);
    const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / 86400000);
    if (diffDias < 0) return 'expired';
    if (diffDias <= 30) return 'expiring';
    return 'valid';
  }

  statusConfig(prescricao: PrescriptionDTO) {
    return STATUS_CONFIG[this.status(prescricao)];
  }

  diasRestantes(prescricao: PrescriptionDTO): number {
    const hoje = new Date();
    const vencimento = new Date(prescricao.expirationDate);
    return Math.ceil((vencimento.getTime() - hoje.getTime()) / 86400000);
  }

  formatarData(iso: string): string {
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  baixar(prescricao: PrescriptionDTO): void {
    this.baixando.set(prescricao.number);
    this.prescriptionService.baixarPdf(prescricao.profissional.nomeUsuario, prescricao.number).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `receita-${prescricao.number}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.baixando.set(null);
      },
      error: () => {
        this.baixando.set(null);
        this.erro.set('Não foi possível baixar o PDF da receita.');
      },
    });
  }
}
