import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ConsultaDTO } from '../models/consulta.model';

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  private readonly baseUrl = `${API_BASE_URL}/consultas`;

  constructor(private http: HttpClient) {}

  listarPorPaciente(nomeUsuario: string): Observable<ConsultaDTO[]> {
    return this.http.get<ConsultaDTO[]>(`${this.baseUrl}/pacientes/${nomeUsuario}`);
  }

  listarPorProfissional(nomeUsuario: string): Observable<ConsultaDTO[]> {
    return this.http.get<ConsultaDTO[]>(`${this.baseUrl}/profissionais/${nomeUsuario}`);
  }

  atualizar(consultaId: number, consulta: ConsultaDTO): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${consultaId}`, consulta);
  }
}
