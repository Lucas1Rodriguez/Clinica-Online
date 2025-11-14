import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteRegistrar } from './componente-registro';

describe('ComponenteRegistrar', () => {
  let component: ComponenteRegistrar;
  let fixture: ComponentFixture<ComponenteRegistrar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteRegistrar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteRegistrar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
