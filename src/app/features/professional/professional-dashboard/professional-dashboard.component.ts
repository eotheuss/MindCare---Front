import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Users, LogOut, Search, TrendingUp, AlertCircle } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ProfissionalService } from '../../../core/services/profissional.service';
import { PacienteDTO } from '../../../core/models/paciente.model';
import { EstadoPaciente } from '../../../core/models/enums';

@Component({
  selector: 'app-professional-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './professional-dashboard.component.html',
  styleUrl: './professional-dashboard.component.scss',
})
export class ProfessionalDashboardComponent implements OnInit {
  readonly icons = { Users, LogOut, Search, TrendingUp, AlertCircle };

  readonly pacientes = signal<PacienteDTO[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);
  readonly busca = signal('');

  readonly pacientesFiltrados = computed(() => {
    const termo = this.busca().toLowerCase().trim();
    if (!termo) return this.pacientes();
    return this.pacientes().filter((p) => p.nomeCompleto.toLowerCase().includes(termo));
  });

  readonly totalPrecisamAtencao = computed(
    () => this.pacientes().filter((p) => p.estadoPaciente === EstadoPaciente.ATENCAO).length
  );

  constructor(
    public auth: AuthService,
    private profissionalService: ProfissionalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.profissionalService.listarPacientes(nomeUsuario).subscribe({
      next: (pacientes) => {
        this.pacientes.set(pacientes);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar seus pacientes.');
        this.carregando.set(false);
      },
    });
  }

  estadoLabel(estado: string | undefined): string {
    switch (estado) {
      case EstadoPaciente.ATENCAO:
        return 'Atenção';
      case EstadoPaciente.MELHORANDO:
        return 'Melhorando';
      case EstadoPaciente.ESTAVEL:
        return 'Estável';
      default:
        return 'Sem avaliação';
    }
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  iniciais(nome: string): string {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}
