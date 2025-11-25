# 🔒 Sistema de Protección de Rutas

## 📋 Resumen

Se han implementado **guards** para proteger las rutas de la aplicación, asegurando que solo usuarios autenticados puedan acceder a las páginas protegidas.

---

## 🛡️ Guards Implementados

### 1. **AuthGuard** (`auth.guard.ts`)
**Propósito**: Protege rutas para que solo usuarios autenticados puedan acceder.

**Comportamiento**:
- ✅ Si el usuario está autenticado → Permite acceso
- ❌ Si no está autenticado → Redirige a `/login` con `returnUrl`

**Rutas protegidas**:
- `/productos`
- `/movimientos`
- `/usuarios`

### 2. **LoginGuard** (`login.guard.ts`)
**Propósito**: Previene que usuarios autenticados accedan a la página de login.

**Comportamiento**:
- ✅ Si el usuario NO está autenticado → Permite acceso al login
- ❌ Si YA está autenticado → Redirige a `/productos`

**Rutas protegidas**:
- `/login`

### 3. **RoleGuard** (`role.guard.ts`)
**Propósito**: Protege rutas según el rol del usuario.

**Comportamiento**:
- ✅ Si el usuario tiene el rol requerido → Permite acceso
- ❌ Si no tiene el rol → Redirige a `/productos`

**Roles disponibles**:
- `ADMIN` - Acceso completo
- `CAJERO` - Ventas y consultas
- `ALMACENERO` - Movimientos de inventario

**Rutas con restricción de rol**:
- `/usuarios` → Solo `ADMIN`

---

## 🚀 Configuración de Rutas

```typescript
// app-routing-module.ts

const routes: Routes = [
  // Login - protegido con LoginGuard (redirige si ya autenticado)
  { 
    path: 'login', 
    component: Login,
    canActivate: [LoginGuard]
  },
  
  // Productos - requiere autenticación
  { 
    path: 'productos', 
    component: Productos,
    canActivate: [AuthGuard]
  },
  
  // Movimientos - requiere autenticación
  { 
    path: 'movimientos', 
    component: Movimientos,
    canActivate: [AuthGuard]
  },
  
  // Usuarios - requiere autenticación Y rol ADMIN
  { 
    path: 'usuarios', 
    component: Usuarios,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  }
];
```

---

## 🔄 Flujo de Autenticación

### Caso 1: Usuario No Autenticado
```
1. Usuario intenta acceder a /productos
2. AuthGuard detecta que no está autenticado
3. Guarda returnUrl = /productos
4. Redirige a /login?returnUrl=/productos
5. Usuario hace login exitoso
6. Sistema redirige a /productos (la URL original)
```

### Caso 2: Usuario Ya Autenticado
```
1. Usuario autenticado intenta ir a /login
2. LoginGuard detecta que YA está autenticado
3. Redirige automáticamente a /productos
```

### Caso 3: Usuario Sin Rol Adecuado
```
1. Usuario CAJERO intenta acceder a /usuarios
2. AuthGuard permite (está autenticado)
3. RoleGuard verifica roles ['ADMIN']
4. Usuario no es ADMIN → Redirige a /productos
```

---

## 🎨 Actualizaciones en el Sidebar

### Filtrado por Roles
El sidebar ahora filtra automáticamente los items del menú según el rol del usuario:

```typescript
menuItems = [
  { 
    title: 'Productos', 
    url: '/productos', 
    icon: Package 
    // Sin roles = todos pueden ver
  },
  { 
    title: 'Movimientos', 
    url: '/movimientos', 
    icon: TrendingUp 
    // Sin roles = todos pueden ver
  },
  { 
    title: 'Usuarios', 
    url: '/usuarios', 
    icon: Users,
    roles: ['ADMIN'] // Solo ADMIN ve este item
  }
];
```

### Información del Usuario
- Avatar con iniciales del usuario
- Nombre completo
- Rol (ADMIN, CAJERO, ALMACENERO)
- Botón de "Cerrar Sesión"

---

## 📦 Archivos Creados/Modificados

### Nuevos Archivos
```
frontend/src/app/core/interceptors/
├── auth.guard.ts          (Guard de autenticación)
├── login.guard.ts         (Guard de login)
└── role.guard.ts          (Guard de roles)
```

### Archivos Modificados
```
frontend/src/app/
├── app-routing-module.ts          (Rutas protegidas con guards)
├── features/pages/login/login.ts  (Manejo de returnUrl)
├── shared/sidebar/sidebar.ts      (Filtrado por roles + logout)
├── shared/sidebar/sidebar.html    (UI de usuario + logout)
└── shared/shared-module.ts        (Icono LogOut)
```

---

## 🧪 Casos de Prueba

### Test 1: Acceso Directo Sin Autenticación
```bash
# Cerrar sesión (localStorage vacío)
# Intentar acceder directamente: http://localhost:4200/productos
# ✅ Debe redirigir a: http://localhost:4200/login?returnUrl=/productos
```

### Test 2: Login y Redirección
```bash
# Desde /login?returnUrl=/movimientos
# Hacer login exitoso
# ✅ Debe redirigir a: /movimientos (no a /productos)
```

### Test 3: Usuario Autenticado en Login
```bash
# Usuario autenticado intenta ir a /login
# ✅ Debe redirigir automáticamente a: /productos
```

### Test 4: Restricción por Rol
```bash
# Usuario CAJERO autenticado
# Intentar acceder a /usuarios
# ✅ Debe redirigir a: /productos
# ✅ El item "Usuarios" NO debe aparecer en el sidebar
```

### Test 5: Logout
```bash
# Usuario autenticado en /productos
# Click en "Cerrar Sesión"
# ✅ Debe confirmar con dialog
# ✅ Debe redirigir a: /login
# ✅ localStorage debe estar vacío
```

---

## 🔐 Seguridad Adicional

### AuthService
El servicio de autenticación maneja:
- ✅ `hasValidSession()` - Verifica sesión válida
- ✅ `hasRole(role)` - Verifica rol específico
- ✅ `isAdmin()` - Atajo para verificar ADMIN
- ✅ `getCurrentUser()` - Obtiene usuario actual
- ✅ `getToken()` - Obtiene token JWT (si existe)
- ✅ `logout()` - Limpia sesión y redirige

### localStorage
```typescript
// Estructura de datos guardada
{
  "authData": {
    "isAuthenticated": true,
    "usuario": {
      "usuarios_id": 1,
      "usuarios_nombre": "Admin User",
      "usuarios_email": "admin@example.com",
      "usuarios_rol": "ADMIN"
    },
    "token": "jwt_token_here"
  }
}
```

---

## 🎯 Mejoras Futuras (Opcional)

### 1. Refresh Token
Implementar renovación automática de token cuando expire.

### 2. Interceptor HTTP
Agregar token JWT a todas las peticiones HTTP automáticamente:
```typescript
// http.interceptor.ts
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(req);
  }
}
```

### 3. Página 403 Forbidden
Crear página personalizada para "Acceso Denegado" en lugar de redirigir a productos.

### 4. Guard de Confirmación
Prevenir navegación con cambios sin guardar:
```typescript
export class CanDeactivateGuard implements CanDeactivate<ComponentWithChanges> {
  canDeactivate(component: ComponentWithChanges) {
    if (component.hasUnsavedChanges()) {
      return confirm('¿Deseas salir sin guardar cambios?');
    }
    return true;
  }
}
```

---

## ✅ Estado Actual

**✅ IMPLEMENTADO Y FUNCIONANDO**

- ✅ AuthGuard protege rutas principales
- ✅ LoginGuard previene acceso a login si autenticado
- ✅ RoleGuard restringe /usuarios solo para ADMIN
- ✅ Sidebar filtra items por rol
- ✅ Botón de logout funcional
- ✅ Información de usuario en sidebar
- ✅ ReturnUrl después del login

---

## 🚀 Cómo Probar

1. **Cerrar sesión** (si está autenticado)
2. **Intentar acceder** a `http://localhost:4200/productos`
3. **Verificar redirección** a login con returnUrl
4. **Hacer login** con credenciales válidas
5. **Verificar redirección** a la URL original
6. **Verificar sidebar** muestra solo items permitidos según rol
7. **Hacer logout** y verificar limpieza de sesión

---

**Fecha de implementación**: 25 de noviembre de 2025  
**Estado**: ✅ **COMPLETADO Y PROBADO**
