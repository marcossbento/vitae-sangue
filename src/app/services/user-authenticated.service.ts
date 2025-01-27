import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticatedService {
  private apiUrl = 'http://localhost:8080';
  private userKey = 'userLogado'; // Chave para armazenar o usuário no localStorage

  constructor(private http: HttpClient) { }

  getUserLogado(): Observable<any> {
    // Verifica se o usuário está armazenado no localStorage
    const cachedUser = localStorage.getItem(this.userKey);
    if (cachedUser) {
      console.log('Usuário em cache: ', JSON.parse(cachedUser));
      return of(JSON.parse(cachedUser)); // Retorna os dados do usuário armazenados no localStorage
    }

    // Caso contrário, faz a requisição à API para buscar o usuário
    return this.http.get('http://localhost:8080/usuario/logado').pipe(
      map((response: any) => {
        // Armazena o usuário no localStorage após a requisição
        localStorage.setItem(this.userKey, JSON.stringify(response));
        console.log('Usuário carregado da API: ', response);
        return response;
      }),
      catchError((error) => {
        console.error('Erro ao buscar o usuário logado: ', error);
        throw error; // Ou trate o erro de outra forma
      })
    );
  }
}
