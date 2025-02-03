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

  geAlltUser() {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '10')
      .set('sort', '');

    return this.http.get<any>(`${this.apiUrl}`,  { params });
  }

  getUser(id: any) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getLoggedUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logado`).pipe(
      map((response: any) => ({
        id: response.id,
        name: response.nome || 'Usuário',
        email: response.email,
        isAdmin: response.isAdmin,
        establishment: response.estabelecimento || 'Estabelecimento não definido',
        nameFirstLetter: (response.nome?.[0] || 'U').toUpperCase()
      }))
    );
  }
}
