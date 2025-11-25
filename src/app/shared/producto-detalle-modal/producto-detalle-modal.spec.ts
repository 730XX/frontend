import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoDetalleModal } from './producto-detalle-modal';

describe('ProductoDetalleModal', () => {
  let component: ProductoDetalleModal;
  let fixture: ComponentFixture<ProductoDetalleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoDetalleModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoDetalleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
