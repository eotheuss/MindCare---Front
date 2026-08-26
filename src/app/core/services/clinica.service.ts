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

  buscarPorCnpj(clinicaCnpj: string): Observable<ClinicaDTO> {
    return this.http.get<ClinicaDTO>(`${this.baseUrl}/${clinicaCnpj}/cnpj`);
  }

  buscarPorNome(nome: string): Observable<ClinicaDTO> {
    return this.http.get<ClinicaDTO>(`${this.baseUrl}/${nome}/nome`);
  }

  buscarPacientes(clinicaCnpj: string): Observable<PacienteDTO[]> {
    return this.http.get<PacienteDTO[]>(`${this.baseUrl}/${clinicaCnpj}/pacientes`);
  }

  buscarProfissionais(clinicaCnpj: string): Observable<ProfissionalDTO[]> {
    return this.http.get<ProfissionalDTO[]>(`${this.baseUrl}/${clinicaCnpj}/profissionais`);
  }

  buscarConsultas(clinicaCnpj: string): Observable<ConsultaDTO[]> {
    return this.http.get<ConsultaDTO[]>(`${this.baseUrl}/${clinicaCnpj}/consultas`);
  }

  /** Faturamento bruto (antes do desconto de comissão) de um mês/ano específico. */
  buscarFaturamento(clinicaCnpj: string, ano: number, mes: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${clinicaCnpj}/faturamento`, {
      params: { ano, mes },
    });
  }

  /** Receita líquida (após desconto de comissão) de um mês/ano específico. */
  buscarReceitaAposDescontos(clinicaCnpj: string, ano: number, mes: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${clinicaCnpj}/receita/descontos`, {
      params: { ano, mes },
    });
  }

  cadastrar(clinica: ClinicaDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, clinica);
  }

  atualizar(clinicaCnpj: string, clinica: ClinicaDTO): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${clinicaCnpj}`, clinica);
  }
}