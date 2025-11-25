import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosDetalleModal } from './movimientos-detalle-modal';

describe('MovimientosDetalleModal', () => {
  let component: MovimientosDetalleModal;
  let fixture: ComponentFixture<MovimientosDetalleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientosDetalleModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosDetalleModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
