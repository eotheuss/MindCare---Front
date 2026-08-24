import { Component, Input } from '@angular/core';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';

export type StatAccent = 'blue' | 'purple' | 'teal' | 'pink' | 'orange' | 'green';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input({ required: true }) icon!: LucideIconData;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string;
  @Input() hint?: string;
  @Input() accent: StatAccent = 'blue';
}
