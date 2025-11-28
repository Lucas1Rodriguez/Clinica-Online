import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteEstadisticasAdmin } from './componente-estadisticas-admin';

describe('ComponenteEstadisticasAdmin', () => {
  let component: ComponenteEstadisticasAdmin;
  let fixture: ComponentFixture<ComponenteEstadisticasAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteEstadisticasAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteEstadisticasAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
