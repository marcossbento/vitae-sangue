import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `http://localhost:8080/usuario`;

  constructor(private http: HttpClient) { }

  createUser(dadosRequisicao: any) {
    return this.http.post(this.apiUrl, dadosRequisicao);
  }

  updateUser(dadosRequisicao: any) {
    return this.http.put(`${this.apiUrl}/${dadosRequisicao.id}`, dadosRequisicao);
  }

  resetPasswordUser(dadosRequisicao: any) {
    return this.http.put(`${this.apiUrl}/${dadosRequisicao.userId}/alterarsenha`, dadosRequisicao);
  }

  getUser(id: any) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
