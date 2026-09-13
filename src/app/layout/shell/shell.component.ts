import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Building2,
  UserPlus,
  CalendarDays,
  LogOut,
  Menu,
  Activity,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ClinicaService } from '../../core/services/clinica.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  readonly icons = { LayoutDashboard, Building2, UserPlus, CalendarDays, LogOut, Menu, Activity };
  readonly sidebarOpen = signal(false);
  readonly possuiClinica = signal(false);

  readonly navItems = computed(() => [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: CalendarDays, label: 'Agenda', route: '/admin/agenda' },
    ...(this.possuiClinica()
      ? []
      : [{ icon: Building2, label: 'Nova clínica', route: '/admin/clinicas/nova' }]),
  ]);

  constructor(
    public auth: AuthService,
    private clinicaService: ClinicaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.clinicaService.buscarPorAdmin(nomeUsuario).subscribe((clinica) => {
      this.possuiClinica.set(!!clinica);
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  iniciais(): string {
    const nome = this.auth.nomeUsuario();
    return nome ? nome.slice(0, 2).toUpperCase() : 'AD';
  }
}
