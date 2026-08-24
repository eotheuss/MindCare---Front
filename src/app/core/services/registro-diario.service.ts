import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { RegistroDiarioDTO } from '../models/registro-diario.model';

@Injectable({ providedIn: 'root' })
export class RegistroDiarioService {
  private readonly baseUrl = `${API_BASE_URL}/registrosDiarios`;

  constructor(private http: HttpClient) {}

  listar(nomeUsuario: string): Observable<RegistroDiarioDTO[]> {
    return this.http.get<RegistroDiarioDTO[]>(`${this.baseUrl}/${nomeUsuario}`);
  }

  cadastrar(nomeUsuario: string, registro: RegistroDiarioDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/cadastrarRegistroDiario/${nomeUsuario}`, registro);
  }
}
