import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteBienvenida } from './componente-bienvenida';

describe('ComponenteBienvenida', () => {
  let component: ComponenteBienvenida;
  let fixture: ComponentFixture<ComponenteBienvenida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteBienvenida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteBienvenida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
