import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Building2, Plus, Trash2, Users } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { ClinicaService } from '../../../core/services/clinica.service';
import { ProfissionalService } from '../../../core/services/profissional.service';
import { PLANOS_ASSINATURA, PlanoAssinatura, Sexo, TIPOS_PROFISSIONAL, TipoProfissional, UserRole } from '../../../core/models/enums';
import { ProfissionalDTO } from '../../../core/models/profissional.model';

const TAXA_COMISSAO_POR_PLANO: Record<PlanoAssinatura, number> = {
  [PlanoAssinatura.BASICO]: 0.2,
  [PlanoAssinatura.PROFISSIONAL]: 0.15,
  [PlanoAssinatura.CLINICA]: 0.1,
};

@Component({
  selector: 'app-clinica-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './clinica-form.component.html',
  styleUrl: './clinica-form.component.scss',
})
export class ClinicaFormComponent {
  readonly icons = { Building2, Plus, Trash2, Users };
  readonly planos = PLANOS_ASSINATURA;
  readonly tiposProfissional = TIPOS_PROFISSIONAL;

  readonly enviando = signal(false);
  readonly erro = signal<string | null>(null);
  readonly sucesso = signal(false);

  form = this.fb.group({
    nome: ['', Validators.required],
    endereco: ['', Validators.required],
    planoAssinatura: [PlanoAssinatura.PROFISSIONAL, Validators.required],
    taxaComissao: [TAXA_COMISSAO_POR_PLANO[PlanoAssinatura.PROFISSIONAL], [Validators.required, Validators.min(0), Validators.max(1)]],
    profissionais: this.fb.array([this.criarProfissionalForm()]),
  });

  constructor(
    private fb: FormBuilder,
    private clinicaService: ClinicaService,
    private profissionalService: ProfissionalService,
    private router: Router
  ) {}

  get profissionaisArray(): FormArray {
    return this.form.get('profissionais') as FormArray;
  }

  private criarProfissionalForm() {
    return this.fb.group({
      nomeCompleto: ['', Validators.required],
      nomeUsuario: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      dataNascimento: ['', Validators.required],
      genero: [Sexo.FEMININO, Validators.required],
      tipoProfissional: [TipoProfissional.PSICOLOGO, Validators.required],
      registroProfissional: ['', Validators.required],
    });
  }

  adicionarProfissional(): void {
    this.profissionaisArray.push(this.criarProfissionalForm());
  }

  removerProfissional(index: number): void {
    if (this.profissionaisArray.length > 1) {
      this.profissionaisArray.removeAt(index);
    }
  }

  selecionarPlano(plano: PlanoAssinatura): void {
    this.form.patchValue({
      planoAssinatura: plano,
      taxaComissao: TAXA_COMISSAO_POR_PLANO[plano],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.profissionaisArray.controls.forEach((c) => c.markAllAsTouched());
      return;
    }

    this.enviando.set(true);
    this.erro.set(null);

    const valores = this.form.getRawValue();

    const profissionaisDTO: ProfissionalDTO[] = valores.profissionais.map((p) => ({
      nomeUsuario: p.nomeUsuario!,
      senha: p.senha!,
      nomeCompleto: p.nomeCompleto!,
      dataNascimento: p.dataNascimento!,
      genero: p.genero!,
      ativo: true,
      userRole: UserRole.PROFISSIONAL,
      tipoProfissional: p.tipoProfissional!,
      registroProfissional: p.registroProfissional!,
    }));

    forkJoin(profissionaisDTO.map((dto) => this.profissionalService.cadastrar(dto)))
      .pipe(
        switchMap(() =>
          this.clinicaService.cadastrar({
            nome: valores.nome!,
            endereco: valores.endereco!,
            taxaComissao: valores.taxaComissao!,
            planoAssinatura: valores.planoAssinatura!,
            profissionais: profissionaisDTO,
            pacientes: [],
            consultas: [],
          })
        ),
        catchError((err) => {
          this.erro.set(
            err?.status === 0
              ? 'Não foi possível conectar à API em localhost:8080. Verifique se o backend está rodando.'
              : 'Não foi possível concluir o cadastro. Veja a nota abaixo sobre a limitação atual do backend ao vincular profissionais na clínica.'
          );
          return of(null);
        })
      )
      .subscribe((resultado) => {
        this.enviando.set(false);
        if (resultado !== null) {
          this.sucesso.set(true);
          setTimeout(() => this.router.navigate(['/admin/dashboard']), 1500);
        }
      });
  }
}
