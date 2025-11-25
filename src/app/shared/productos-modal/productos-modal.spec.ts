import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosModal } from './productos-modal';

describe('ProductosModal', () => {
  let component: ProductosModal;
  let fixture: ComponentFixture<ProductosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
