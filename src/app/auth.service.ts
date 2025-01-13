import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth/login'; // URL do backend

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, senha });
  }
}