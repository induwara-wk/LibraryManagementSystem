import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

const TOKEN_HEADER_KEY = 'Authorization';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // If this is an OPTIONS request, let it pass through
  if (req.method === 'OPTIONS') {
    return next(req);
  }
  
  let authReq = req;
  const token = window.sessionStorage.getItem('auth-token');
  if (token != null) {
    authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
  return next(authReq);
}; 