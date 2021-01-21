import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAppointmentComponent } from './quick-appointment.component';

describe('QuickAppointmentComponent', () => {
  let component: QuickAppointmentComponent;
  let fixture: ComponentFixture<QuickAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
