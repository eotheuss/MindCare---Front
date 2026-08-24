import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Calendar, Clock, Check } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { ProfissionalDTO } from '../../../core/models/profissional.model';
import { RecomendacaoHorario } from '../../../core/models/recomendacao-horario.model';

@Component({
  selector: 'app-appointment-scheduling',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './appointment-scheduling.component.html',
  styleUrl: './appointment-scheduling.component.scss',
})
export class AppointmentSchedulingComponent implements OnInit {
  readonly icons = { ArrowLeft, Calendar, Clock, Check };

  readonly carregandoProfissionais = signal(true);
  readonly profissionais = signal<ProfissionalDTO[]>([]);
  readonly profissionalSelecionado = signal<ProfissionalDTO | null>(null);

  readonly data = signal<string>('');
  readonly horariosDisponiveis = signal<RecomendacaoHorario[]>([]);
  readonly carregandoHorarios = signal(false);
  readonly horarioSelecionado = signal<RecomendacaoHorario | null>(null);

  readonly agendando = signal(false);
  readonly confirmado = signal(false);
  readonly erro = signal<string | null>(null);

  readonly dataMinima = new Date().toISOString().split('T')[0];

  constructor(
    private auth: AuthService,
    private pacienteService: PacienteService,
    private agendamentoService: AgendamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.pacienteService.buscarPorNomeUsuario(nomeUsuario).subscribe({
      next: (paciente) => {
        const profissionais = (paciente.profissionais as ProfissionalDTO[] | undefined) ?? [];
        this.profissionais.set(profissionais);
        if (profissionais.length === 1) {
          this.profissionalSelecionado.set(profissionais[0]);
        }
        this.carregandoProfissionais.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar seus profissionais vinculados.');
        this.carregandoProfissionais.set(false);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/paciente/inicio']);
  }

  selecionarProfissional(profissional: ProfissionalDTO): void {
    this.profissionalSelecionado.set(profissional);
    this.data.set('');
    this.horariosDisponiveis.set([]);
    this.horarioSelecionado.set(null);
  }

  onDataChange(data: string): void {
    this.data.set(data);
    this.horarioSelecionado.set(null);
    const profissional = this.profissionalSelecionado();
    if (!data || !profissional) return;

    this.carregandoHorarios.set(true);
    this.erro.set(null);
    this.agendamentoService.recomendarHorariosParaProfissionalEData(data, profissional.nomeUsuario).subscribe({
      next: (horarios) => {
        this.horariosDisponiveis.set(horarios);
        this.carregandoHorarios.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível buscar horários para essa data.');
        this.carregandoHorarios.set(false);
      },
    });
  }

  formatarHora(dataHoraConsulta: string): string {
    return dataHoraConsulta.slice(11, 16);
  }

  confirmar(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    const profissional = this.profissionalSelecionado();
    const horario = this.horarioSelecionado();
    if (!nomeUsuario || !profissional || !horario) return;

    this.agendando.set(true);
    this.erro.set(null);

    this.agendamentoService
      .agendar({
        paciente: { nomeUsuario },
        profissional: { nomeUsuario: profissional.nomeUsuario },
        valorConsulta: 0,
        dataHoraConsulta: horario.dataHoraConsulta,
        atendida: false,
        cancelada: false,
      })
      .subscribe({
        next: () => {
          this.agendando.set(false);
          this.confirmado.set(true);
          setTimeout(() => this.voltar(), 2000);
        },
        error: () => {
          this.agendando.set(false);
          this.erro.set('Não foi possível agendar a consulta. O horário pode já estar ocupado.');
        },
      });
  }
}
