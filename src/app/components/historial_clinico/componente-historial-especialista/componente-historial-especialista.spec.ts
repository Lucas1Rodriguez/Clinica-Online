import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteHistorialEspecialista } from './componente-historial-especialista';

describe('ComponenteHistorialEspecialista', () => {
  let component: ComponenteHistorialEspecialista;
  let fixture: ComponentFixture<ComponenteHistorialEspecialista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteHistorialEspecialista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteHistorialEspecialista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
