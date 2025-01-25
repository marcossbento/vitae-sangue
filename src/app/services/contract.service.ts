
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `http://localhost:8080/contrato`; // Ajuste para o endpoint correto

  constructor(private http: HttpClient) { }

  createContrato(dadosContrato: any) {
    return this.http.post(this.apiUrl, dadosContrato);
  }
}