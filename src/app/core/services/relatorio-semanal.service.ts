import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { RelatorioSemanalDTO } from '../models/relatorio-semanal.model';

@Injectable({ providedIn: 'root' })
export class RelatorioSemanalService {
  private readonly baseUrl = `${API_BASE_URL}/relatoriosSemanais`;

  constructor(private http: HttpClient) {}

  gerar(nomeUsuario: string): Observable<RelatorioSemanalDTO> {
    return this.http.post<RelatorioSemanalDTO>(`${this.baseUrl}/gerar/${nomeUsuario}`, {});
  }

  listarPorPaciente(nomeUsuario: string): Observable<RelatorioSemanalDTO[]> {
    return this.http.get<RelatorioSemanalDTO[]>(`${this.baseUrl}/${nomeUsuario}`);
  }

  atualizar(relatorio: RelatorioSemanalDTO): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/atualizarRelatorioSemanal`, relatorio);
  }
}
