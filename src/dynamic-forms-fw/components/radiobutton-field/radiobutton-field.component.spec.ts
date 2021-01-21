import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiobuttonFieldComponent } from './radiobutton-field.component';

describe('RadiobuttonFieldComponent', () => {
  let component: RadiobuttonFieldComponent;
  let fixture: ComponentFixture<RadiobuttonFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiobuttonFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiobuttonFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
