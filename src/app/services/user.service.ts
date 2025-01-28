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
}
