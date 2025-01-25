import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HemocentroService {
  private apiUrl = 'http://localhost:8080/hemocentro';

  constructor(private http: HttpClient) { }

  getHemocentros(): Observable<any> {

    // Traz todos os registros em uma única página
    const params = new HttpParams()
      .set('page', '0')       // Página fixa
      .set('size', '10')
      .set('sort', 'estabelecimento.nome');

    return this.http.get(this.apiUrl, { params });
  }
}