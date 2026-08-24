import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Calendar, BookOpen, Pill, FileText } from 'lucide-angular';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  readonly items = [
    { icon: Calendar, label: 'Início', route: '/paciente/inicio' },
    { icon: BookOpen, label: 'Diário', route: '/paciente/diario' },
    { icon: Pill, label: 'Prescrição', route: '/paciente/prescricoes' },
    { icon: FileText, label: 'Relatórios', route: '/paciente/relatorios' },
  ];
}
