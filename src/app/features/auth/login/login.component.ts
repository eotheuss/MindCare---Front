import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/enums';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  form = this.fb.group({
    nomeUsuario: ['', Validators.required],
    senha: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { nomeUsuario, senha } = this.form.getRawValue();
    this.authService.login({ nomeUsuario: nomeUsuario!, senha: senha! }).subscribe({
      next: (resposta) => {
        this.loading.set(false);
        this.router.navigate([this.rotaInicialPorRole(resposta.userRole)]);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) {
          this.errorMessage.set('Usuário ou senha incorretos.');
        } else if (err.status === 404) {
          this.errorMessage.set('Usuário não encontrado.');
        } else {
          this.errorMessage.set('Não foi possível conectar à API. Verifique se o backend está rodando em localhost:8080.');
        }
      },
    });
  }

  private rotaInicialPorRole(userRole: string): string {
    switch (userRole) {
      case UserRole.PACIENTE:
        return '/paciente/inicio';
      case UserRole.PROFISSIONAL:
        return '/profissional';
      case UserRole.ADMIN:
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }
}
