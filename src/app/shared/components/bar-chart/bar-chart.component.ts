import { Component, Input, computed, signal } from '@angular/core';

export interface BarChartPoint {
  label: string;
  bruto: number;
  liquido: number;
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
  private readonly _data = signal<BarChartPoint[]>([]);

  @Input() set data(value: BarChartPoint[]) {
    this._data.set(value ?? []);
  }

  readonly hovered = signal<number | null>(null);

  readonly maxValue = computed(() => {
    const values = this._data().flatMap((d) => [d.bruto, d.liquido]);
    return Math.max(1, ...values);
  });

  readonly points = computed(() =>
    this._data().map((point, index) => ({
      ...point,
      index,
      brutoHeight: (point.bruto / this.maxValue()) * 100,
      liquidoHeight: (point.liquido / this.maxValue()) * 100,
    }))
  );

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
