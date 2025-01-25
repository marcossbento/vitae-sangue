import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HemocentroService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getHemocentros(): Observable<any> {

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '10')
      .set('sort', 'estabelecimento.nome');

    return this.http.get(`${this.apiUrl}/hemocentro`, { params });
  }

  getEstabelecimento(): Observable<any> {

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '10')
      .set('sort', 'id');

    return this.http.get(`${this.apiUrl}/estabelecimento`, { params }).pipe(
      map((response: any) => response.content) // Extrai o array de perfis
    );
  }
}