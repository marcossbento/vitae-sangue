import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserAuthenticatedService {
  private apiUrl = 'http://localhost:8080/usuario';
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.fetchUser();
  }

  private async fetchUser(): Promise<void> {
    console.log('Fetching user data...');
    try {
      const user = await this.http.get<any>(`${this.apiUrl}/logado`)
        .pipe(
          catchError((error) => {
            console.error('Error fetching user:', error);
            return [];
          })
        )
        .toPromise();
      this.userSubject.next(user || null);
    } catch (error) {
      console.error('Error fetching user:', error);
      this.userSubject.next(null);
    }
  }

  getPermissionResource(resource: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/permissoes/${resource}`);
  }

  async getUserLogado(): Promise<any> {
    // Aguarda o carregamento dos dados do usuário
    await this.fetchUser();
    return this.userSubject.value;
  }

  refreshUser(): void {
    this.fetchUser();
  }
}
