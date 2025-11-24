import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { 
  ApiResponse, 
  LoginCredentials, 
  LoginResponse, 
  Usuario,
  AuthData 
} from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = environment.apiUrl;
  private readonly API_KEY = 'sk_live_master_2024_XyZ123AbC456';
  private readonly STORAGE_KEY = 'authData';

  // Observable del estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Observable del usuario actual
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Headers con API Key para todas las peticiones
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': this.API_KEY
    });
  }

  /**
   * Login - Autenticar usuario
   * Endpoint: POST /usuarios/login
   */
  login(credentials: LoginCredentials): Observable<ApiResponse<LoginResponse>> {
    const url = `${this.API_BASE_URL}/usuarios/login`;
    
    // Headers sin API Key para login (ruta pública)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<ApiResponse<LoginResponse>>(
      url,
      credentials,
      { headers }
    ).pipe(
      tap(response => {
        // Si el login es exitoso (tipo 1), guardar datos
        if (response.tipo === 1 && response.data) {
          this.setAuthData({
            isAuthenticated: true,
            usuario: response.data.usuario,
            token: response.data.token
          });
          
          // Actualizar observables
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(response.data.usuario);
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout - Cerrar sesión
   */
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('isAuthenticated'); // Limpiar el viejo formato
    localStorage.removeItem('user'); // Limpiar el viejo formato
    
    // Actualizar observables
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    // Redirigir al login
    this.router.navigate(['/login']);
  }

  /**
   * Verificar si hay una sesión válida
   */
  hasValidSession(): boolean {
    const authData = this.getAuthData();
    return authData !== null && authData.isAuthenticated === true;
  }

  /**
   * Obtener datos de autenticación desde localStorage
   */
  private getAuthData(): AuthData | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as AuthData;
    } catch {
      return null;
    }
  }

  /**
   * Guardar datos de autenticación en localStorage
   */
  private setAuthData(authData: AuthData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser(): Usuario | null {
    const authData = this.getAuthData();
    return authData?.usuario || null;
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    const authData = this.getAuthData();
    return authData?.token || null;
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: 'ADMIN' | 'CAJERO' | 'ALMACENERO'): boolean {
    const user = this.getCurrentUser();
    return user?.usuarios_rol === role;
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}
