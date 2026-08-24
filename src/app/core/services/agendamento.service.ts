import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { ConsultaDTO } from '../models/consulta.model';
import { RecomendacaoHorario } from '../models/recomendacao-horario.model';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private readonly baseUrl = `${API_BASE_URL}/agendamentos`;

  constructor(private http: HttpClient) {}

  agendar(consulta: ConsultaDTO): Observable<void> {
    return this.http.post<void>(this.baseUrl, consulta);
  }

  recomendarHorarios(tipoProfissional: string): Observable<RecomendacaoHorario[]> {
    return this.http.get<RecomendacaoHorario[]>(`${this.baseUrl}/recomendarHorarios`, {
      params: { tipoProfissional },
    });
  }

  recomendarHorariosParaProfissionalEData(
    dataInformada: string,
    nomeUsuario: string
  ): Observable<RecomendacaoHorario[]> {
    return this.http.get<RecomendacaoHorario[]>(
      `${this.baseUrl}/recomendarHorarios/${dataInformada}/profissional/${nomeUsuario}`
    );
  }
}
