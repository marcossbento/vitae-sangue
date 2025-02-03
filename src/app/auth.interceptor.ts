import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken'); // Chave correta
  console.log('Token no interceptor:', token);  // Log para depurar
  if (token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, // Formato esperado pelo Spring
      },
    });
    return next(modifiedReq);
  }
  return next(req);
};
