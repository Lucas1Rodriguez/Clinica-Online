import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteSolicitarTurno } from './componente-solicitar-turno';

describe('ComponenteSolicitarTurno', () => {
  let component: ComponenteSolicitarTurno;
  let fixture: ComponentFixture<ComponenteSolicitarTurno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteSolicitarTurno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteSolicitarTurno);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
