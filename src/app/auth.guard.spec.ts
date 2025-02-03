import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';  // Para testar roteamento
import { AuthGuard } from './auth.guard';  // O nome correto da sua classe de guard
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Para testar navegação
      providers: [AuthGuard]  // Providencia o AuthGuard
    });
    guard = TestBed.inject(AuthGuard);  // Injeta o AuthGuard
    router = TestBed.inject(Router);  // Injeta o Router para testar navegação
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if token exists', () => {
    // Simula a presença do token no localStorage
    spyOn(localStorage, 'getItem').and.returnValue('valid-token');

    // Testa se a navegação é permitida (should return true)
    expect(guard.canActivate(null as any, null as any)).toBeTrue();
  });

  it('should redirect to login if token is not present', () => {
    // Simula a ausência do token no localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);

    // Espiona o método de navegação do Router
    const navigateSpy = spyOn(router, 'navigate');

    // Testa se o método de navegação é chamado corretamente
    expect(guard.canActivate(null as any, null as any)).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
