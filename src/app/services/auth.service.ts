import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth/login'; // URL para autenticação

  constructor(private http: HttpClient) {}

  // Método de login que retorna um token
  login(email: string, senha: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, senha });
  }

  // Método para armazenar o token no localStorage
  setToken(token: string): void {
    localStorage.setItem('authToken', token); // Armazenando com a chave 'authToken'
  }

  // Método para recuperar o token armazenado
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Recuperando com a chave 'authToken'
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null; // Verifica se o token está presente
  }

  // Método para remover o token (logout)
  removeToken(): void {
    localStorage.removeItem('authToken'); // Remove o token
  }
}
