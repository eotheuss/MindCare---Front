import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  Building2,
  LogOut,
  Menu,
  Activity,
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly icons = { LayoutDashboard, Building2, LogOut, Menu, Activity };
  readonly sidebarOpen = signal(false);

  readonly navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: Building2, label: 'Nova clínica', route: '/admin/clinicas/nova' },
  ];

  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

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
