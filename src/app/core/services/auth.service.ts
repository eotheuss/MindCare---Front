import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { DadosAutenticacao, DadosTokenJWT } from '../models/auth.model';
import { ClinicaService } from './clinica.service';

const TOKEN_KEY = 'mindcare_token';
const ROLE_KEY = 'mindcare_role';
const USERNAME_KEY = 'mindcare_username';
const POSSUI_CLINICA = 'possui_clinica';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly userRole = signal<string | null>(localStorage.getItem(ROLE_KEY));
  readonly nomeUsuario = signal<string | null>(localStorage.getItem(USERNAME_KEY));

  constructor(private http: HttpClient, private clinicaService: ClinicaService) {}

  login(dados: DadosAutenticacao): Observable<DadosTokenJWT> {
    return this.http.post<DadosTokenJWT>(`${API_BASE_URL}/login`, dados).pipe(
      tap((resposta) => {
        localStorage.setItem(TOKEN_KEY, resposta.token);
        localStorage.setItem(ROLE_KEY, resposta.userRole);
        localStorage.setItem(USERNAME_KEY, dados.nomeUsuario);
        this.userRole.set(resposta.userRole);
        this.nomeUsuario.set(dados.nomeUsuario);
        localStorage.setItem(POSSUI_CLINICA, this.verificaCadastroClinica(dados.nomeUsuario));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(POSSUI_CLINICA);
    this.userRole.set(null);
    this.nomeUsuario.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  verificaCadastroClinica(nomeUsuario: string): string {
    let possuiClinica = "false";
    this.clinicaService.buscarPorAdmin(nomeUsuario).subscribe({
      next: (clinica) => {
        if(clinica) {
          possuiClinica = "true";
        } else {
          possuiClinica = "false";
        }
      }, 
      error: (error) => {
        console.log(error);
        possuiClinica = "false";
      }
    })
    return possuiClinica;
  }

  possuiClinicaCadastrada(): boolean { 
    let possuiClinicaString = localStorage.getItem(POSSUI_CLINICA);
    let possuiClinica = false;
    if(possuiClinicaString === "true") {
      possuiClinica = true;
    } else if(possuiClinicaString === "false") {
      possuiClinica = false;
    }
    return possuiClinica;
  }
}
