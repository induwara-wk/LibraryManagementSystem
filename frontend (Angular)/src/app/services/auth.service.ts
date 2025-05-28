import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, MessageResponse } from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.tokenService.getToken();
    const userData = this.getUserData();
    
    if (token && userData) {
      this.currentUserSubject.next(userData);
    } else {
      // Clear any invalid data
      this.tokenService.removeToken();
      this.removeUserData();
    }
  }

  private saveUserData(user: AuthResponse): void {
    localStorage.setItem('user-data', JSON.stringify(user));
  }

  private getUserData(): AuthResponse | null {
    const userData = localStorage.getItem('user-data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  private removeUserData(): void {
    localStorage.removeItem('user-data');
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, credentials)
      .pipe(
        tap(response => {
          this.tokenService.saveToken(response.accessToken);
          this.saveUserData(response);
          this.currentUserSubject.next(response);
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  register(userData: RegisterRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/signup`, userData);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.removeUserData();
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken() && !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.includes('ROLE_ADMIN') || false;
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }
} 