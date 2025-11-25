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
 * Guard de Roles
 * Protege rutas basándose en el rol del usuario
 * Roles disponibles: ADMIN, CAJERO, ALMACENERO
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Verificar si está autenticado primero
    if (!this.authService.hasValidSession()) {
      console.warn('⚠️ No autenticado. Redirigiendo al login...');
      return this.router.createUrlTree(['/login']);
    }

    // Obtener los roles permitidos desde la configuración de la ruta
    const allowedRoles = route.data['roles'] as Array<'ADMIN' | 'CAJERO' | 'ALMACENERO'>;
    
    if (!allowedRoles || allowedRoles.length === 0) {
      // Si no hay roles especificados, permitir acceso
      return true;
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasPermission = allowedRoles.some(role => this.authService.hasRole(role));

    if (hasPermission) {
      return true;
    }

    // Si no tiene permiso, redirigir a index (o página de "sin permisos")
    console.warn('⚠️ Acceso denegado. Rol insuficiente.');
    return this.router.createUrlTree(['/index']);
  }
}
