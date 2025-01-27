import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private apiUrl = `http://localhost:8080/requisicao`;

  constructor(private http: HttpClient) { }

  getRequisicoes(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('react', '8') // Valor fixo conforme exemplo
      .set('size', size.toString())
      .set('page', page.toString())
      .set('expt', '') // Valor vazio ou ajuste conforme necessidade
      .set('id', '');  // Valor vazio ou ajuste conforme necessidade

    return this.http.get(this.apiUrl, { params });
  }

  createRequisicao(dadosRequisicao: any) {
    return this.http.post(this.apiUrl, dadosRequisicao);
  }
}
