import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMisTurnosUsuario } from './componente-mis-turnos-usuario';

describe('ComponenteMisTurnosUsuario', () => {
  let component: ComponenteMisTurnosUsuario;
  let fixture: ComponentFixture<ComponenteMisTurnosUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMisTurnosUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMisTurnosUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
