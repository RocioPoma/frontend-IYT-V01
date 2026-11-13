import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        // 401 = sesión vencida o inválida → volver al inicio. 403 = sin permiso: se muestra el mensaje, sin cerrar sesión.
        if (err instanceof HttpErrorResponse && err.status === 401 && token && !request.url.includes('/user/login')) {
          localStorage.removeItem('token');
          if (this.router.url !== '/') this.router.navigate(['/']);
        }
        return throwError(() => err);
      })
    );
  }
}
