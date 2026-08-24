import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { PacienteDTO } from '../models/paciente.model';
import { PrescriptionDTO } from '../models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly baseUrl = `${API_BASE_URL}/pacientes`;

  constructor(private http: HttpClient) {}

  cadastrar(paciente: PacienteDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, paciente);
  }

  buscarPorNomeUsuario(nomeUsuario: string): Observable<PacienteDTO> {
    return this.http.get<PacienteDTO>(`${this.baseUrl}/${nomeUsuario}`);
  }

  selecionarProfissional(profissionalNomeUsuario: string, pacienteNomeUsuario: string): Observable<PacienteDTO> {
    return this.http.patch<PacienteDTO>(
      `${this.baseUrl}/selecionarProfissional/${profissionalNomeUsuario}/${pacienteNomeUsuario}`,
      {}
    );
  }

  atualizarEstadoPaciente(
    profissionalNomeUsuario: string,
    pacienteNomeUsuario: string,
    estadoPaciente: string
  ): Observable<PacienteDTO> {
    return this.http.patch<PacienteDTO>(
      `${this.baseUrl}/atualizarEstadoPaciente/${profissionalNomeUsuario}/${pacienteNomeUsuario}`,
      {},
      { params: { estadoPaciente } }
    );
  }

  listarPrescricoes(nomeUsuario: string): Observable<PrescriptionDTO[]> {
    return this.http.get<PrescriptionDTO[]>(`${this.baseUrl}/${nomeUsuario}/prescriptions`);
  }
}
