import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteMenu } from './componente-menu';

describe('ComponenteMenu', () => {
  let component: ComponenteMenu;
  let fixture: ComponentFixture<ComponenteMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
