import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `http://localhost:8080/perfil`;

  constructor(private http: HttpClient) { }

  getProfiles(): Observable<any[]> {
    // Configura os parâmetros de paginação
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '10')
      .set('sort', 'id'); // Para array: .set('sort', 'id,nome')

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => response.content) // Extrai o array de perfis
    );
  }

  createProfile(dadosRequisicao: any) {
    return this.http.post(this.apiUrl, dadosRequisicao);
  }

  updateProfile(dadosRequisicao: any) {
    return this.http.put(this.apiUrl, dadosRequisicao);
  }

  getProfile(id: any) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
