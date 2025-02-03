import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private apiUrl = `http://localhost:8080/requisicao`;

  constructor(private http: HttpClient) { }

  getRequisicoes(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('react', '8')
      .set('size', size.toString())
      .set('page', page.toString())
      .set('expt', '')
      .set('id', '');

    return this.http.get(this.apiUrl, { params });
  }

  getRequisitionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro na requisição:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  createRequisicao(dadosRequisicao: any) {
    return this.http.post(this.apiUrl, dadosRequisicao);
  }

  approveRequisicao(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/aprovar`, null);
  }

  denyRequisicao(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/rejeitar`, null);
  }
}
