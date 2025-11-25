import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
  isLoginPage: boolean = false;

  constructor(private router: Router) {
    // Detectar cambios de ruta para mostrar/ocultar sidebar
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage = this.isLoginRoute(event.urlAfterRedirects) || this.isLoginRoute(event.url);
      });

    // Verificar ruta inicial
    this.isLoginPage = this.isLoginRoute(this.router.url);
  }

  /**
   * Verifica si la URL corresponde a la página de login
   * Ignora query params como ?returnUrl=...
   */
  private isLoginRoute(url: string): boolean {
    return url.startsWith('/login');
  }
}
