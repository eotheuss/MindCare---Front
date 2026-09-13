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
  LucideIconData,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ClinicaService } from '../../core/services/clinica.service';

interface NavItem {
  icon: LucideIconData;
  label: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly icons = { LayoutDashboard, Building2, UserPlus, CalendarDays, LogOut, Menu, Activity };
  readonly sidebarOpen = signal(false);
  readonly possuiClinica = signal(false);

  readonly navItems = computed<NavItem[]>(() => [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      route: '/admin/dashboard',
    },
    ...(!this.possuiClinica()
    ? []
    : [
        {
          icon: CalendarDays,
          label: 'Agenda',
          route: '/admin/agenda',
        }
      ]),
    ...(this.possuiClinica()
    ? []
    : [
        {
          icon: Building2,
          label: 'Nova clínica',
          route: '/admin/nova-clinica',
        }
      ])
  ]);

  constructor(
    public auth: AuthService,
    private clinicaService: ClinicaService,
    private router: Router
  ) {
    const nomeUsuario = this.auth.nomeUsuario();

    this.clinicaService.buscarPorAdmin(nomeUsuario).subscribe({
      next: (clinica) => {
        if(!clinica) {
          this.possuiClinica.set(false);
        } else {
          this.possuiClinica.set(true);
        }
      },
      error: (error) => {
        console.log(error);
      }
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
