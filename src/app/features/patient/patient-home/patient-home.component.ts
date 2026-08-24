import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, LogOut, Plus, CalendarCheck, Calendar, BookOpen } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { RegistroDiarioService } from '../../../core/services/registro-diario.service';
import { RegistroDiarioDTO } from '../../../core/models/registro-diario.model';
import { moodConfigFor } from '../../../core/models/enums';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-patient-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavComponent, RouterLink],
  templateUrl: './patient-home.component.html',
  styleUrl: './patient-home.component.scss',
})
export class PatientHomeComponent implements OnInit {
  readonly icons = { LogOut, Plus, CalendarCheck, Calendar, BookOpen };
  readonly moodConfigFor = moodConfigFor;

  readonly entradas = signal<RegistroDiarioDTO[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  constructor(
    public auth: AuthService,
    private registroDiarioService: RegistroDiarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.registroDiarioService.listar(nomeUsuario).subscribe({
      next: (registros) => {
        this.entradas.set(registros.slice(0, 5));
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar suas entradas recentes.');
        this.carregando.set(false);
      },
    });
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  formatarData(iso: string | null | undefined): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}
