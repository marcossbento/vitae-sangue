import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080';

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
