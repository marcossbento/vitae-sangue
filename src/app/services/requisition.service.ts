import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private apiUrl = `http://localhost:8080/requisicao`;

  constructor(private http: HttpClient) { }

  createRequisicao(dadosRequisicao: any) {
    return this.http.post(this.apiUrl, dadosRequisicao);
  }
}
