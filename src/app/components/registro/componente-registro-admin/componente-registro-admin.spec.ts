import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteRegistroAdmin } from './componente-registro-admin';

describe('ComponenteRegistroAdmin', () => {
  let component: ComponenteRegistroAdmin;
  let fixture: ComponentFixture<ComponenteRegistroAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteRegistroAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteRegistroAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
