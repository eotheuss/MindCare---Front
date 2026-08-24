import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, ArrowLeft, Save, Smile, Frown } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { RegistroDiarioService } from '../../../core/services/registro-diario.service';
import { MOOD_CONFIG, NivelHumor } from '../../../core/models/enums';

@Component({
  selector: 'app-diary-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './diary-entry.component.html',
  styleUrl: './diary-entry.component.scss',
})
export class DiaryEntryComponent {
  readonly icons = { ArrowLeft, Save, Smile, Frown };
  readonly moods = MOOD_CONFIG;
  readonly hoje = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  mood = signal<NivelHumor | null>(null);
  positivos = signal('');
  negativos = signal('');
  salvando = signal(false);
  salvo = signal(false);
  erro = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private registroDiarioService: RegistroDiarioService,
    private router: Router
  ) {}

  voltar(): void {
    this.router.navigate(['/paciente/inicio']);
  }

  salvar(): void {
    const nomeUsuario = this.auth.nomeUsuario();
    const nivelHumor = this.mood();
    if (!nomeUsuario || !nivelHumor || this.salvo()) return;

    this.salvando.set(true);
    this.erro.set(null);

    this.registroDiarioService
      .cadastrar(nomeUsuario, {
        nivelHumor,
        pontosPositivos: this.positivos(),
        dificuldadesDesafios: this.negativos(),
      })
      .subscribe({
        next: () => {
          this.salvando.set(false);
          this.salvo.set(true);
          setTimeout(() => this.voltar(), 1500);
        },
        error: () => {
          this.salvando.set(false);
          this.erro.set('Não foi possível salvar o diário. Tente novamente.');
        },
      });
  }
}
