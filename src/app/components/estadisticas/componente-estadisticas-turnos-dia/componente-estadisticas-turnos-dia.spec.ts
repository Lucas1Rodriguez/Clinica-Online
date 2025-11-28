import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEstadisticasTurnosDia } from './componente-estadisticas-turnos-dia';

describe('ComponenteEstadisticasTurnosDia', () => {
  let component: ComponenteEstadisticasTurnosDia;
  let fixture: ComponentFixture<ComponenteEstadisticasTurnosDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEstadisticasTurnosDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteEstadisticasTurnosDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
