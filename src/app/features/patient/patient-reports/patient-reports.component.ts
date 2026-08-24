import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, TrendingUp, TrendingDown, FileText, Calendar } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { RelatorioSemanalService } from '../../../core/services/relatorio-semanal.service';
import { RelatorioSemanalDTO } from '../../../core/models/relatorio-semanal.model';

@Component({
  selector: 'app-patient-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './patient-reports.component.html',
  styleUrl: './patient-reports.component.scss',
})
export class PatientReportsComponent implements OnInit {
  readonly icons = { ArrowLeft, TrendingUp, TrendingDown, FileText, Calendar };

  readonly relatorios = signal<RelatorioSemanalDTO[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private relatorioSemanalService: RelatorioSemanalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    if (!nomeUsuario) return;

    this.relatorioSemanalService.listarPorPaciente(nomeUsuario).subscribe({
      next: (relatorios) => {
        this.relatorios.set(relatorios);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar seus relatórios.');
        this.carregando.set(false);
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/paciente/inicio']);
  }

  formatarPeriodo(faixaDeDatas: string): string {
    const [inicio, fim] = (faixaDeDatas || '').split('^');
    return `${this.formatarData(inicio)} - ${this.formatarData(fim)}`;
  }

  private formatarData(iso: string | undefined): string {
    if (!iso) return '';
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}
