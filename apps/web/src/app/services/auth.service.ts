import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/api/v1/auth';
  private readonly tokenKey = 'skillbridge_token';

  readonly isAuthenticated = signal<boolean>(this.hasToken());
  readonly currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {
    // Attempt to load user on init if token exists
    if (this.isAuthenticated()) {
      this.me().subscribe({
        error: () => this.logout(),
      });
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, {
        name,
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setSession(res);
        })
      );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.token);
    this.isAuthenticated.set(true);
    this.currentUser.set(res.user);
  }
}
