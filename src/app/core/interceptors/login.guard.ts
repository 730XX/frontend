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
 * Guard de Login
 * Previene que usuarios autenticados accedan al login
 * Los redirige automáticamente a productos
 */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Si el usuario YA está autenticado, redirigir a productos
    if (this.authService.hasValidSession()) {
      console.log('✅ Usuario ya autenticado. Redirigiendo a productos...');
      return this.router.createUrlTree(['/productos']);
    }

    // Si no está autenticado, permitir acceso al login
    return true;
  }
}
