import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteLogsAdmin } from './componente-logs-admin';

describe('ComponenteLogsAdmin', () => {
  let component: ComponenteLogsAdmin;
  let fixture: ComponentFixture<ComponenteLogsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteLogsAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteLogsAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
