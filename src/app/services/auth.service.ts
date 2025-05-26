import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthState,
  JwtPayload,
} from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'e-banking-token';
  private userKey = 'e-banking-user';

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user && this.isTokenValid(token)) {
      this.updateAuthState({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null,
      });
      this.scheduleTokenRefresh(token);
    } else {
      this.clearStoredAuth();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.updateAuthState({
      ...this.authStateSubject.value,
      loading: true,
      error: null,
    });

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError((error) => {
          this.handleAuthError(error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    this.updateAuthState({
      ...this.authStateSubject.value,
      loading: true,
      error: null,
    });

    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        catchError((error) => {
          this.handleAuthError(error);
          return throwError(() => error);
        }),
        tap(() => {
          this.updateAuthState({
            ...this.authStateSubject.value,
            loading: false,
          });
        })
      );
  }

  logout(): void {
    this.clearStoredAuth();
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const token = this.getStoredToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/refresh`, { token })
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError((error) => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  private handleAuthSuccess(response: LoginResponse): void {
    this.storeToken(response.token);
    this.storeUser(response.user);

    this.updateAuthState({
      isAuthenticated: true,
      user: response.user,
      token: response.token,
      loading: false,
      error: null,
    });

    this.scheduleTokenRefresh(response.token);
  }

  private handleAuthError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred during authentication';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (error.status === 403) {
      errorMessage = 'Access denied';
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server';
    }

    this.updateAuthState({
      ...this.authStateSubject.value,
      loading: false,
      error: errorMessage,
    });
  }

  private updateAuthState(newState: AuthState): void {
    this.authStateSubject.next(newState);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    return token;
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    if (!userStr || userStr === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      // Clear invalid data
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  private isTokenValid(token: string): boolean {
    if (!token || token === 'undefined' || token === 'null') {
      return false;
    }
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  private scheduleTokenRefresh(token: string): void {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const refreshTime = expirationTime - currentTime - 5 * 60 * 1000; // Refresh 5 minutes before expiry

      if (refreshTime > 0) {
        timer(refreshTime).subscribe(() => {
          if (this.isAuthenticated()) {
            this.refreshToken().subscribe({
              error: () => this.logout(),
            });
          }
        });
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
    }
  }
}
