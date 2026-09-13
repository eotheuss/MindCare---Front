import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, UserPlus, ShieldCheck, Stethoscope, HeartPulse } from 'lucide-angular';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ProfissionalService } from '../../../core/services/profissional.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { Sexo, TIPOS_PROFISSIONAL, TipoProfissional, UserRole } from '../../../core/models/enums';
import { ProfissionalDTO } from '../../../core/models/profissional.model';
import { PacienteDTO } from '../../../core/models/paciente.model';
import { UsuarioDTO } from '../../../core/models/usuario.model';
import { Router } from '@angular/router';

const ROLES = [
  { valor: UserRole.ADMIN, label: 'Administrador', descricao: 'Acesso total: gerencia clínica, usuários e agenda.', icon: ShieldCheck },
  { valor: UserRole.PROFISSIONAL, label: 'Profissional', descricao: 'Psicólogo(a) ou psiquiatra vinculado a uma clínica.', icon: Stethoscope },
  { valor: UserRole.PACIENTE, label: 'Paciente', descricao: 'Usa o diário, agenda consultas e recebe prescrições.', icon: HeartPulse },
];

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.scss',
})
export class UsuarioFormComponent {
  readonly icons = { UserPlus };
  readonly roles = ROLES;
  readonly tiposProfissional = TIPOS_PROFISSIONAL;
  readonly UserRole = UserRole;

  readonly enviando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly sucesso = signal<string | null>(null);

  form = this.fb.group({
    userRole: [UserRole.PACIENTE, Validators.required],
    nomeCompleto: ['', Validators.required],
    nomeUsuario: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    dataNascimento: ['', Validators.required],
    genero: [Sexo.FEMININO, Validators.required],
    tipoProfissional: [TipoProfissional.PSICOLOGO],
    registroProfissional: [''],
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private profissionalService: ProfissionalService,
    private pacienteService: PacienteService,
    private router: Router
  ) {
    this.form.get('userRole')!.valueChanges.subscribe((role) => this.atualizarValidadoresPorRole(role));
    this.atualizarValidadoresPorRole(this.form.value.userRole!);
  }

  selecionarRole(role: UserRole): void {
    this.form.patchValue({ userRole: role });
  }

  private atualizarValidadoresPorRole(role: UserRole | null): void {
    const tipoProfissional = this.form.get('tipoProfissional')!;
    const registroProfissional = this.form.get('registroProfissional')!;

    if (role === UserRole.PROFISSIONAL) {
      tipoProfissional.setValidators([Validators.required]);
      registroProfissional.setValidators([Validators.required]);
    } else {
      tipoProfissional.clearValidators();
      registroProfissional.clearValidators();
    }
    tipoProfissional.updateValueAndValidity();
    registroProfissional.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);
    this.sucesso.set(null);

    const valores = this.form.getRawValue();
    const base: UsuarioDTO = {
      nomeUsuario: valores.nomeUsuario!,
      senha: valores.senha!,
      nomeCompleto: valores.nomeCompleto!,
      dataNascimento: valores.dataNascimento!,
      genero: valores.genero!,
      ativo: true,
      userRole: valores.userRole!,
    };

    switch (valores.userRole) {
      case UserRole.ADMIN:
        this.usuarioService.cadastrarAdmin(base).subscribe({
          next: () => this.aoSalvarComSucesso('Administrador cadastrado com sucesso.'),
          error: (err) => this.aoFalhar(err),
        });
        break;
      case UserRole.PROFISSIONAL: {
        const profissional: ProfissionalDTO = {
          ...base,
          tipoProfissional: valores.tipoProfissional!,
          registroProfissional: valores.registroProfissional!,
        };
        this.profissionalService.cadastrar(profissional).subscribe({
          next: () => this.aoSalvarComSucesso('Profissional cadastrado com sucesso.'),
          error: (err) => this.aoFalhar(err),
        });
        break;
      }
      case UserRole.PACIENTE: {
        const paciente: PacienteDTO = { ...base };
        this.pacienteService.cadastrar(paciente).subscribe({
          next: () => this.aoSalvarComSucesso('Paciente cadastrado com sucesso.'),
          error: (err) => this.aoFalhar(err),
        });
        break;
      }
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  private aoSalvarComSucesso(mensagem: string): void {
    this.enviando.set(false);
    this.sucesso.set(mensagem);
    const roleAtual = this.form.value.userRole!;
    this.form.reset({
      userRole: roleAtual,
      genero: Sexo.FEMININO,
      tipoProfissional: TipoProfissional.PSICOLOGO,
    });
  }

  private aoFalhar(err: unknown): void {
    this.enviando.set(false);
    const mensagem = (err as { error?: { mensagem?: string } })?.error?.mensagem;
    this.erro.set(mensagem ?? 'Não foi possível cadastrar o usuário.');
  }
}
