import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarProductosModal } from './agregar-productos-modal';

describe('AgregarProductosModal', () => {
  let component: AgregarProductosModal;
  let fixture: ComponentFixture<AgregarProductosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgregarProductosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarProductosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
