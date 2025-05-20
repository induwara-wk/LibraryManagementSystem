import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../models/auth.models';

const AUTH_API = 'http://localhost:8080/api/auth/';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(AUTH_API + 'signin', credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Debug
          this.saveToken(response.accessToken);
          this.saveUser({
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          });
          this.currentUserSubject.next({
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles
          });
        })
      );
  }

  register(user: SignupRequest): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user);
  }

  logout(): void {
    window.sessionStorage.clear();
    this.currentUserSubject.next(null);
  }

  saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserFromStorage(): User | null {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user !== null && user.roles.includes('ROLE_ADMIN');
  }
}
