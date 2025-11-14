import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteRegistroEspecialista } from './componente-registro-especialista';

describe('ComponenteRegistroEspecialista', () => {
  let component: ComponenteRegistroEspecialista;
  let fixture: ComponentFixture<ComponenteRegistroEspecialista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteRegistroEspecialista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteRegistroEspecialista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
