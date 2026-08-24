import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

export interface NovaPrescricao {
  issueDate: string;
  expirationDate: string;
  medicines: string;
  controlled: boolean;
  arquivo: File;
}

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly baseUrl = `${API_BASE_URL}/prescriptions`;

  constructor(private http: HttpClient) {}

  enviar(pacienteNomeUsuario: string, dados: NovaPrescricao): Observable<void> {
    const formData = new FormData();
    formData.append('issueDate', dados.issueDate);
    formData.append('expirationDate', dados.expirationDate);
    formData.append('medicines', dados.medicines);
    formData.append('controlled', String(dados.controlled));
    formData.append('arquivo', dados.arquivo);
    return this.http.post<void>(`${this.baseUrl}/${pacienteNomeUsuario}`, formData);
  }

  baixarPdf(profissionalNomeUsuario: string, number: string): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/${profissionalNomeUsuario}/${number}/pdf`, null, {
      responseType: 'blob',
    });
  }
}
