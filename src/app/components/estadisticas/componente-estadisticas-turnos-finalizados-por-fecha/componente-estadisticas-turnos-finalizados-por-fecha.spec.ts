import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEstadisticasTurnosFinalizadosPorFecha } from './componente-estadisticas-turnos-finalizados-por-fecha';

describe('ComponenteEstadisticasTurnosFinalizadosPorFecha', () => {
  let component: ComponenteEstadisticasTurnosFinalizadosPorFecha;
  let fixture: ComponentFixture<ComponenteEstadisticasTurnosFinalizadosPorFecha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEstadisticasTurnosFinalizadosPorFecha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteEstadisticasTurnosFinalizadosPorFecha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
