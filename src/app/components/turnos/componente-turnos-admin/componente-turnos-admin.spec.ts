import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteTurnosAdmin } from './componente-turnos-admin';

describe('ComponenteTurnosAdmin', () => {
  let component: ComponenteTurnosAdmin;
  let fixture: ComponentFixture<ComponenteTurnosAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteTurnosAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteTurnosAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
