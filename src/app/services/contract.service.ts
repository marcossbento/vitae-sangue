
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `http://localhost:8080/contrato`;

  constructor(private http: HttpClient) { }

  getContracts(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('target', '0')
      .set('size', size.toString())
      .set('page', page.toString());

    return this.http.get(this.apiUrl, { params });
  }

  getContractById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createContrato(dadosContrato: any) {
    return this.http.post(this.apiUrl, dadosContrato);
  }
}