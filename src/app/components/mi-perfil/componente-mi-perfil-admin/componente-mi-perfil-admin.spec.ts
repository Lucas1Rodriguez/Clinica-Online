import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMiPerfilAdmin } from './componente-mi-perfil-admin';

describe('ComponenteMiPerfilAdmin', () => {
  let component: ComponenteMiPerfilAdmin;
  let fixture: ComponentFixture<ComponenteMiPerfilAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMiPerfilAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMiPerfilAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
