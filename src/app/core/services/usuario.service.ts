import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { UsuarioDTO } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly baseUrl = `${API_BASE_URL}/usuarios`;

  constructor(private http: HttpClient) {}

  cadastrarAdmin(usuario: UsuarioDTO): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/admin`, usuario);
  }
}
