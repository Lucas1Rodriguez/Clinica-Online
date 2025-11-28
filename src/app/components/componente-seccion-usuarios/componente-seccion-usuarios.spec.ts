import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteSeccionUsuarios } from './componente-seccion-usuarios';

describe('ComponenteSeccionUsuarios', () => {
  let component: ComponenteSeccionUsuarios;
  let fixture: ComponentFixture<ComponenteSeccionUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteSeccionUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteSeccionUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
