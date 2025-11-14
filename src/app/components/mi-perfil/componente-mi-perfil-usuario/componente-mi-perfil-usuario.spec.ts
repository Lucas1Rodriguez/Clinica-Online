import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMiPerfilUsuario } from './componente-mi-perfil-usuario';

describe('ComponenteMiPerfilUsuario', () => {
  let component: ComponenteMiPerfilUsuario;
  let fixture: ComponentFixture<ComponenteMiPerfilUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMiPerfilUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMiPerfilUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
