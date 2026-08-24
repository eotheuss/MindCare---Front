import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ClinicaDTO } from '../models/clinica.model';
import { ConsultaDTO } from '../models/consulta.model';
import { PacienteDTO } from '../models/paciente.model';
import { ProfissionalDTO } from '../models/profissional.model';

@Injectable({ providedIn: 'root' })
export class ClinicaService {
  private readonly baseUrl = `${API_BASE_URL}/clinicas`;

  constructor(private http: HttpClient) {}

  buscarPorId(clinicaId: number): Observable<ClinicaDTO> {
    return this.http.get<ClinicaDTO>(`${this.baseUrl}/${clinicaId}`);
  }

  buscarPacientes(clinicaId: number): Observable<PacienteDTO[]> {
    return this.http.get<PacienteDTO[]>(`${this.baseUrl}/${clinicaId}/pacientes`);
  }

  buscarProfissionais(clinicaId: number): Observable<ProfissionalDTO[]> {
    return this.http.get<ProfissionalDTO[]>(`${this.baseUrl}/${clinicaId}/profissionais`);
  }

  buscarConsultas(clinicaId: number): Observable<ConsultaDTO[]> {
    return this.http.get<ConsultaDTO[]>(`${this.baseUrl}/${clinicaId}/consultas`);
  }

  /** Faturamento bruto (antes do desconto de comissão) de um mês/ano específico. */
  buscarFaturamento(clinicaId: number, ano: number, mes: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${clinicaId}/faturamento`, {
      params: { ano, mes },
    });
  }

  /** Receita líquida (após desconto de comissão) de um mês/ano específico. */
  buscarReceitaAposDescontos(clinicaId: number, ano: number, mes: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${clinicaId}/receita/descontos`, {
      params: { ano, mes },
    });
  }

  cadastrar(clinica: ClinicaDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, clinica);
  }

  atualizar(clinicaId: number, clinica: ClinicaDTO): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${clinicaId}`, clinica);
  }
}
