import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEstadisticasTurnosEspecialistaPorFecha } from './componente-estadisticas-turnos-especialista-por-fecha';

describe('ComponenteEstadisticasTurnosEspecialistaPorFecha', () => {
  let component: ComponenteEstadisticasTurnosEspecialistaPorFecha;
  let fixture: ComponentFixture<ComponenteEstadisticasTurnosEspecialistaPorFecha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEstadisticasTurnosEspecialistaPorFecha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteEstadisticasTurnosEspecialistaPorFecha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
