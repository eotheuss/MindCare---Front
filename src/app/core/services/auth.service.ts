import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { DadosAutenticacao, DadosTokenJWT } from '../models/auth.model';

const TOKEN_KEY = 'mindcare_token';
const ROLE_KEY = 'mindcare_role';
const USERNAME_KEY = 'mindcare_username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly userRole = signal<string | null>(localStorage.getItem(ROLE_KEY));
  readonly nomeUsuario = signal<string | null>(localStorage.getItem(USERNAME_KEY));

  constructor(private http: HttpClient) {}

  login(dados: DadosAutenticacao): Observable<DadosTokenJWT> {
    return this.http.post<DadosTokenJWT>(`${API_BASE_URL}/login`, dados).pipe(
      tap((resposta) => {
        localStorage.setItem(TOKEN_KEY, resposta.token);
        localStorage.setItem(ROLE_KEY, resposta.userRole);
        localStorage.setItem(USERNAME_KEY, dados.nomeUsuario);
        this.userRole.set(resposta.userRole);
        this.nomeUsuario.set(dados.nomeUsuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    this.userRole.set(null);
    this.nomeUsuario.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
