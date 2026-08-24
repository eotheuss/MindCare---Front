import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  Calendar,
  BookOpen,
  FileText,
  Pill,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldAlert,
  Plus,
  X,
  User,
  Sparkles,
} from 'lucide-angular';
import { PacienteService } from '../../../core/services/paciente.service';
import { RegistroDiarioService } from '../../../core/services/registro-diario.service';
import { RelatorioSemanalService } from '../../../core/services/relatorio-semanal.service';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { PacienteDTO } from '../../../core/models/paciente.model';
import { RegistroDiarioDTO } from '../../../core/models/registro-diario.model';
import { RelatorioSemanalDTO } from '../../../core/models/relatorio-semanal.model';
import { PrescriptionDTO } from '../../../core/models/prescription.model';
import { moodConfigFor } from '../../../core/models/enums';

type Tab = 'diarios' | 'relatorios' | 'prescricoes';
type StatusReceita = 'valid' | 'expiring' | 'expired';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss',
})
export class PatientDetailsComponent implements OnInit {
  readonly icons = {
    ArrowLeft, Calendar, BookOpen, FileText, Pill, Upload,
    CheckCircle2, AlertCircle, Clock, ShieldAlert, Plus, X, User, Sparkles,
  };
  readonly moodConfigFor = moodConfigFor;

  nomeUsuario = '';
  readonly paciente = signal<PacienteDTO | null>(null);
  readonly tab = signal<Tab>('diarios');

  readonly diarios = signal<RegistroDiarioDTO[]>([]);
  readonly carregandoDiarios = signal(true);

  readonly relatorios = signal<RelatorioSemanalDTO[]>([]);
  readonly carregandoRelatorios = signal(true);
  readonly gerandoRelatorio = signal(false);

  readonly prescricoes = signal<PrescriptionDTO[]>([]);
  readonly carregandoPrescricoes = signal(true);
  readonly mostrarFormulario = signal(false);
  readonly enviandoReceita = signal(false);
  readonly erro = signal<string | null>(null);

  arquivo: File | null = null;
  arrastando = false;
  issueDate = '';
  expirationDate = '';
  medicamentos: string[] = [''];
  controlled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private registroDiarioService: RegistroDiarioService,
    private relatorioSemanalService: RelatorioSemanalService,
    private prescriptionService: PrescriptionService
  ) {}

  ngOnInit(): void {
    this.nomeUsuario = this.route.snapshot.paramMap.get('nomeUsuario') ?? '';
    if (!this.nomeUsuario) return;

    this.pacienteService.buscarPorNomeUsuario(this.nomeUsuario).subscribe({
      next: (paciente) => this.paciente.set(paciente),
      error: () => this.erro.set('Não foi possível carregar os dados do paciente.'),
    });

    this.carregarDiarios();
    this.carregarRelatorios();
    this.carregarPrescricoes();
  }

  private carregarDiarios(): void {
    this.carregandoDiarios.set(true);
    this.registroDiarioService.listar(this.nomeUsuario).subscribe({
      next: (diarios) => {
        this.diarios.set(diarios);
        this.carregandoDiarios.set(false);
      },
      error: () => this.carregandoDiarios.set(false),
    });
  }

  private carregarRelatorios(): void {
    this.carregandoRelatorios.set(true);
    this.relatorioSemanalService.listarPorPaciente(this.nomeUsuario).subscribe({
      next: (relatorios) => {
        this.relatorios.set(relatorios);
        this.carregandoRelatorios.set(false);
      },
      error: () => this.carregandoRelatorios.set(false),
    });
  }

  private carregarPrescricoes(): void {
    this.carregandoPrescricoes.set(true);
    this.pacienteService.listarPrescricoes(this.nomeUsuario).subscribe({
      next: (prescricoes) => {
        this.prescricoes.set(prescricoes);
        this.carregandoPrescricoes.set(false);
      },
      error: () => this.carregandoPrescricoes.set(false),
    });
  }

  gerarRelatorio(): void {
    this.gerandoRelatorio.set(true);
    this.relatorioSemanalService.gerar(this.nomeUsuario).subscribe({
      next: () => {
        this.gerandoRelatorio.set(false);
        this.carregarRelatorios();
      },
      error: () => {
        this.gerandoRelatorio.set(false);
        this.erro.set('Não foi possível gerar o relatório semanal agora.');
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/profissional']);
  }

  formatarDataLonga(iso: string | null | undefined): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  }

  formatarPeriodo(faixaDeDatas: string): string {
    const [inicio, fim] = (faixaDeDatas || '').split('^');
    return `${this.formatarDataCurta(inicio)} - ${this.formatarDataCurta(fim)}`;
  }

  private formatarDataCurta(iso: string | undefined): string {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarDataCurtaPublica(iso: string): string {
    return this.formatarDataCurta(iso);
  }

  statusReceita(prescricao: PrescriptionDTO): StatusReceita {
    const hoje = new Date();
    const vencimento = new Date(prescricao.expirationDate);
    const diffDias = Math.ceil((vencimento.getTime() - hoje.getTime()) / 86400000);
    if (diffDias < 0) return 'expired';
    if (diffDias <= 30) return 'expiring';
    return 'valid';
  }

  statusLabel(status: StatusReceita): string {
    return status === 'valid' ? 'Válida' : status === 'expiring' ? 'A vencer' : 'Vencida';
  }

  statusIcon(status: StatusReceita) {
    return status === 'valid' ? this.icons.CheckCircle2 : status === 'expiring' ? this.icons.Clock : this.icons.AlertCircle;
  }

  // --- upload de receita ---

  toggleFormulario(): void {
    this.mostrarFormulario.set(!this.mostrarFormulario());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.arrastando = true;
  }

  onDragLeave(): void {
    this.arrastando = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastando = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.arquivo = file;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.arquivo = file;
  }

  adicionarMedicamento(): void {
    this.medicamentos.push('');
  }

  removerMedicamento(index: number): void {
    if (this.medicamentos.length > 1) {
      this.medicamentos.splice(index, 1);
    }
  }

  get podeEnviar(): boolean {
    return !!this.arquivo && !!this.issueDate && !!this.expirationDate && this.medicamentos.some((m) => m.trim() !== '');
  }

  enviarReceita(): void {
    if (!this.podeEnviar || !this.arquivo) return;

    this.enviandoReceita.set(true);
    this.erro.set(null);

    this.prescriptionService
      .enviar(this.nomeUsuario, {
        issueDate: this.issueDate,
        expirationDate: this.expirationDate,
        medicines: this.medicamentos.filter((m) => m.trim() !== '').join(','),
        controlled: this.controlled,
        arquivo: this.arquivo,
      })
      .subscribe({
        next: () => {
          this.enviandoReceita.set(false);
          this.mostrarFormulario.set(false);
          this.arquivo = null;
          this.issueDate = '';
          this.expirationDate = '';
          this.medicamentos = [''];
          this.controlled = false;
          this.carregarPrescricoes();
        },
        error: () => {
          this.enviandoReceita.set(false);
          this.erro.set('Não foi possível enviar a receita. Verifique se você tem permissão para essa ação.');
        },
      });
  }
}
