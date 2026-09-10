import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import {
  LucideAngularModule,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Stethoscope,
  User,
  CircleX,
  CircleCheckBig,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ClinicaService } from '../../core/services/clinica.service';
import { ConsultaDTO } from '../../core/models/consulta.model';

interface DiaCalendario {
  data: Date;
  chave: string;
  noMes: boolean;
  hoje: boolean;
  consultas: ConsultaDTO[];
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function chaveData(data: Date): string {
  return `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.scss',
})
export class AgendaComponent implements OnInit {
  readonly icons = { CalendarDays, ChevronLeft, ChevronRight, Clock, Stethoscope, User, CircleX, CircleCheckBig };
  readonly diasSemana = DIAS_SEMANA;
  readonly meses = MESES;

  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly semClinica = signal(false);

  readonly mesReferencia = signal<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  readonly consultas = signal<ConsultaDTO[]>([]);
  readonly diaSelecionadoChave = signal<string | null>(null);

  readonly tituloMes = computed(() => {
    const ref = this.mesReferencia();
    return `${this.meses[ref.getMonth()]} de ${ref.getFullYear()}`;
  });

  private readonly consultasPorDia = computed(() => {
    const mapa = new Map<string, ConsultaDTO[]>();
    for (const consulta of this.consultas()) {
      const data = new Date(consulta.dataHoraConsulta);
      const chave = chaveData(data);
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(consulta);
    }
    for (const lista of mapa.values()) {
      lista.sort((a, b) => a.dataHoraConsulta.localeCompare(b.dataHoraConsulta));
    }
    return mapa;
  });

  readonly semanas = computed(() => {
    const ref = this.mesReferencia();
    const ano = ref.getFullYear();
    const mes = ref.getMonth();
    const hoje = chaveData(new Date());
    const consultasPorDia = this.consultasPorDia();

    const primeiroDiaMes = new Date(ano, mes, 1);
    const inicioGrade = new Date(ano, mes, 1 - primeiroDiaMes.getDay());

    const dias: DiaCalendario[] = [];
    for (let i = 0; i < 42; i++) {
      const data = new Date(inicioGrade.getFullYear(), inicioGrade.getMonth(), inicioGrade.getDate() + i);
      const chave = chaveData(data);
      dias.push({
        data,
        chave,
        noMes: data.getMonth() === mes,
        hoje: chave === hoje,
        consultas: consultasPorDia.get(chave) ?? [],
      });
    }

    const semanas: DiaCalendario[][] = [];
    for (let i = 0; i < dias.length; i += 7) {
      semanas.push(dias.slice(i, i + 7));
    }
    return semanas;
  });

  readonly consultasDoDiaSelecionado = computed(() => {
    const chave = this.diaSelecionadoChave();
    if (!chave) return [];
    return this.consultasPorDia().get(chave) ?? [];
  });

  constructor(
    private auth: AuthService,
    private clinicaService: ClinicaService
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.clinicaService.buscarPorAdmin(nomeUsuario).subscribe((clinica) => {
      if (!clinica) {
        this.semClinica.set(true);
        this.carregando.set(false);
        return;
      }

      this.clinicaService.buscarConsultas(clinica.cnpj).subscribe({
        next: (consultas) => {
          this.consultas.set(consultas);
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set('Não foi possível carregar as consultas da clínica.');
          this.carregando.set(false);
        },
      });
    });
  }

  mesAnterior(): void {
    const ref = this.mesReferencia();
    this.mesReferencia.set(new Date(ref.getFullYear(), ref.getMonth() - 1, 1));
    this.diaSelecionadoChave.set(null);
  }

  mesSeguinte(): void {
    const ref = this.mesReferencia();
    this.mesReferencia.set(new Date(ref.getFullYear(), ref.getMonth() + 1, 1));
    this.diaSelecionadoChave.set(null);
  }

  selecionarDia(dia: DiaCalendario): void {
    this.diaSelecionadoChave.set(dia.consultas.length ? dia.chave : null);
  }

  formatarHora(dataHoraConsulta: string): string {
    return new Date(dataHoraConsulta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  formatarDiaSelecionado(): string {
    const chave = this.diaSelecionadoChave();
    if (!chave) return '';
    const [ano, mes, dia] = chave.split('-').map(Number);
    return new Date(ano, mes, dia).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  statusConsulta(consulta: ConsultaDTO): 'cancelada' | 'atendida' | 'agendada' {
    if (consulta.cancelada) return 'cancelada';
    if (consulta.atendida) return 'atendida';
    return 'agendada';
  }
}
