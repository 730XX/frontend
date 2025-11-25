import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Eye, EyeOff, Package, Lock, Mail } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  readonly icons = { Eye, EyeOff, Package, Lock, Mail };

  // Datos del formulario
  correo: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;

  // Estados
  loading: boolean = false;
  error: string = '';
  
  // URL de retorno después del login
  private returnUrl: string = '/index';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener la URL de retorno desde los query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/index';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    // Limpiar error previo
    this.error = '';

    // Validaciones básicas
    if (!this.correo || !this.password) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    if (!this.isValidEmail(this.correo)) {
      this.error = 'Por favor ingrese un correo válido';
      return;
    }

    // Autenticación con el backend
    this.loading = true;

    this.authService.login({
      correo: this.correo,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.loading = false;
        
        // Verificar si el login fue exitoso
        if (response.tipo === 1) {
          // Redirigir a la URL de retorno o a productos por defecto
          this.router.navigateByUrl(this.returnUrl);
        } else {
          // Mostrar mensajes de error del backend
          this.error = response.mensajes.join('. ');
        }
      },
      error: (error) => {
        this.loading = false;
        
        // Manejo de errores HTTP
        if (error.status === 401) {
          this.error = 'Credenciales incorrectas';
        } else if (error.status === 0) {
          this.error = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (error.error?.mensajes) {
          this.error = error.error.mensajes.join('. ');
        } else {
          this.error = 'Error al iniciar sesión. Intenta nuevamente.';
        }
        
        console.error('Error en login:', error);
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
