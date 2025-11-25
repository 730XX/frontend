import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard de Autenticación
 * Protege las rutas para que solo usuarios autenticados puedan acceder
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Verificar si el usuario está autenticado
    if (this.authService.hasValidSession()) {
      return true;
    }

    // Si no está autenticado, redirigir al login
    console.warn('⚠️ Acceso denegado. Redirigiendo al login...');
    
    // Guardar la URL a la que intentó acceder para redirigir después del login
    const returnUrl = state.url;
    
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: returnUrl }
    });
  }
}
