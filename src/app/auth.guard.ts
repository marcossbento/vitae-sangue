import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service'; // Importa o serviço que contém o token

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // Recupera o token do AuthService (em memória)
    const token = this.authService.getToken();
    console.log('Token no AuthGuard:', token); // Verifique o valor do token no console

    // Se o token não estiver presente, redireciona para a página de login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    // Se o token estiver presente, permite o acesso
    return true;
  }
}
