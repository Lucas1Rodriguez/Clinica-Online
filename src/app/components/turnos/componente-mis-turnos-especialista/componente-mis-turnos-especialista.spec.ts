import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMisTurnosEspecialista } from './componente-mis-turnos-especialista';

describe('ComponenteMisTurnosEspecialista', () => {
  let component: ComponenteMisTurnosEspecialista;
  let fixture: ComponentFixture<ComponenteMisTurnosEspecialista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMisTurnosEspecialista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMisTurnosEspecialista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
