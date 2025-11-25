import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto, ProductoFormData } from '../../core/interfaces/api-response.interface';

@Component({
  selector: 'app-productos-modal',
  standalone: false,
  templateUrl: './productos-modal.html',
  styleUrl: './productos-modal.scss',
})
export class ProductosModal implements OnChanges {
  @Input() visible: boolean = false;
  @Input() producto: Producto | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<{ id: number, data: ProductoFormData }>();

  productoForm: FormGroup;
  loading: boolean = false;

  // Opciones de unidad
  unidades = [
    { label: 'Unidad', value: 'UND' },
    { label: 'Kilogramo', value: 'KG' },
    { label: 'Litro', value: 'LT' },
    { label: 'Mililitro', value: 'MTS' },
    
  ];

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      productos_nombre: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-\.]+$/)
      ]],
      productos_codigo: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Z0-9\-_]+$/)
      ]],
      productos_unidad: ['', Validators.required],
      productos_precio: [null, [
        Validators.required,
        Validators.min(0),
        Validators.max(999999.99)
      ]],
      productos_stock: [0, [
        Validators.required, 
        Validators.min(0),
        Validators.max(999999.999)
      ]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['producto'] && this.producto) {
      // Rellenar el formulario con los datos del producto
      this.productoForm.patchValue({
        productos_nombre: this.producto.productos_nombre,
        productos_codigo: this.producto.productos_codigo,
        productos_unidad: this.producto.productos_unidad,
        productos_precio: this.producto.productos_precio ? parseFloat(this.producto.productos_precio) : null,
        productos_stock: this.producto.productos_stock ? parseFloat(this.producto.productos_stock) : 0
      });
    }
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.productoForm.reset();
  }

  onSubmit(): void {
    if (this.productoForm.invalid || !this.producto) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Sanitizar y preparar datos
    const formData: ProductoFormData = {
      productos_nombre: this.sanitizeText(this.productoForm.value.productos_nombre),
      productos_codigo: this.productoForm.value.productos_codigo.trim().toUpperCase(),
      productos_unidad: this.productoForm.value.productos_unidad,
      productos_precio: parseFloat(this.productoForm.value.productos_precio),
      productos_stock: parseFloat(this.productoForm.value.productos_stock)
    };

    this.guardar.emit({ id: this.producto.productos_id, data: formData });
  }

  // Helpers para validación
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productoForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;
    if (field.errors['pattern']) {
      if (fieldName === 'productos_nombre') return 'Solo letras, números, espacios, guiones y puntos';
      if (fieldName === 'productos_codigo') return 'Solo letras mayúsculas, números, guiones y guiones bajos';
    }
    
    return '';
  }

  /**
   * Sanitizar texto eliminando caracteres peligrosos
   */
  private sanitizeText(text: string): string {
    if (!text) return '';
    // Trim y eliminar múltiples espacios
    return text.trim().replace(/\s+/g, ' ');
  }
}
