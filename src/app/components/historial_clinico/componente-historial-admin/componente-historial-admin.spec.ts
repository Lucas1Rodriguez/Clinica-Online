import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteHistorialAdmin } from './componente-historial-admin';

describe('ComponenteHistorialAdmin', () => {
  let component: ComponenteHistorialAdmin;
  let fixture: ComponentFixture<ComponenteHistorialAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteHistorialAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteHistorialAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
