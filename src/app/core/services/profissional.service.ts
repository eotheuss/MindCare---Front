import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ProfissionalDTO } from '../models/profissional.model';
import { PacienteDTO } from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class ProfissionalService {
  private readonly baseUrl = `${API_BASE_URL}/profissionais`;

  constructor(private http: HttpClient) {}

  cadastrar(profissional: ProfissionalDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, profissional);
  }

  listar(): Observable<ProfissionalDTO[]> {
    return this.http.get<ProfissionalDTO[]>(this.baseUrl);
  }

  buscarPorNomeUsuario(nomeUsuario: string): Observable<ProfissionalDTO> {
    return this.http.get<ProfissionalDTO>(`${this.baseUrl}/${nomeUsuario}`);
  }

  listarPacientes(nomeUsuario: string): Observable<PacienteDTO[]> {
    return this.http.get<PacienteDTO[]>(`${this.baseUrl}/${nomeUsuario}/pacientes`);
  }

  buscarPorTipo(tipoProfissional: string): Observable<ProfissionalDTO[]> {
    return this.http.get<ProfissionalDTO[]>(`${this.baseUrl}/tipoProfissional/${tipoProfissional}`);
  }
}
