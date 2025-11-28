import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEstadisticasTurnosEspecialidad } from './componente-estadisticas-turnos-especialidad';

describe('ComponenteEstadisticasTurnosEspecialidad', () => {
  let component: ComponenteEstadisticasTurnosEspecialidad;
  let fixture: ComponentFixture<ComponenteEstadisticasTurnosEspecialidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEstadisticasTurnosEspecialidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteEstadisticasTurnosEspecialidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
