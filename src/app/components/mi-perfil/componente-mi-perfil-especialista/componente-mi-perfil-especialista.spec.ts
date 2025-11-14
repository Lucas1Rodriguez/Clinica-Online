import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMiPerfilEspecialista } from './componente-mi-perfil-especialista';

describe('ComponenteMiPerfilEspecialista', () => {
  let component: ComponenteMiPerfilEspecialista;
  let fixture: ComponentFixture<ComponenteMiPerfilEspecialista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMiPerfilEspecialista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMiPerfilEspecialista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
