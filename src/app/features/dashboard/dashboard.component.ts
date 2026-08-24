import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, DollarSign, TrendingUp, Users, UserCheck, Building2 } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClinicaService } from '../../core/services/clinica.service';
import { BarChartComponent, BarChartPoint } from '../../shared/components/bar-chart/bar-chart.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, StatCardComponent, BarChartComponent, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly icons = { DollarSign, TrendingUp, Users, UserCheck, Building2 };

  readonly anoAtual = new Date().getFullYear();
  readonly mesAtual = new Date().getMonth() + 1;

  clinicaCnpj = signal<string | null>(null);
  ano = signal<number>(this.anoAtual);

  loading = signal(false);
  erro = signal<string | null>(null);
  carregado = signal(false);

  nomeClinica = signal<string>('');
  totalPacientes = signal(0);
  totalProfissionais = signal(0);
  planoAssinatura = signal<string>('');

  faturamentoMesAtual = signal(0);
  receitaMesAtual = signal(0);
  serieMensal = signal<BarChartPoint[]>([]);

  readonly faturamentoAnoTotal = computed(() =>
    this.serieMensal().reduce((soma, ponto) => soma + ponto.bruto, 0)
  );
  readonly receitaAnoTotal = computed(() =>
    this.serieMensal().reduce((soma, ponto) => soma + ponto.liquido, 0)
  );

  constructor(private clinicaService: ClinicaService) {}

  carregar(): void {
    const cnpj = this.clinicaCnpj();
    if (!cnpj) {
      this.erro.set('Informe o CNPJ da clínica.');
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    this.clinicaService.buscarPorNome(cnpj).subscribe((resultado) => {
      if (!resultado) {
        this.loading.set(false);
        return;
      }

      this.nomeClinica.set(resultado.nome);
      this.planoAssinatura.set(resultado.planoAssinatura);
      // this.totalPacientes.set(resultado.pacientes.length);
      // this.totalProfissionais.set(resultado.profissionais.length);

      this.carregarSerieMensal(cnpj);
    });

  }

  private carregarSerieMensal(clinicaCnpj: string): void {
    const ano = this.ano();
    const chamadasPorMes = Array.from({ length: 12 }, (_, indice) => {
      const mes = indice + 1;
      return forkJoin({
        bruto: this.clinicaService.buscarFaturamento(clinicaCnpj, ano, mes),
        liquido: this.clinicaService.buscarReceitaAposDescontos(clinicaCnpj, ano, mes),
      }).pipe(catchError(() => of({ bruto: 0, liquido: 0 })));
    });

    forkJoin(chamadasPorMes).subscribe((resultadosPorMes) => {
      const serie: BarChartPoint[] = resultadosPorMes.map((valor, indice) => ({
        label: MESES[indice],
        bruto: valor.bruto,
        liquido: valor.liquido,
      }));

      this.serieMensal.set(serie);
      this.faturamentoMesAtual.set(serie[this.mesAtual - 1]?.bruto ?? 0);
      this.receitaMesAtual.set(serie[this.mesAtual - 1]?.liquido ?? 0);

      this.loading.set(false);
      this.carregado.set(true);
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
