import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureLoginComponent } from './azure-login.component';

describe('AzureLoginComponent', () => {
  let component: AzureLoginComponent;
  let fixture: ComponentFixture<AzureLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AzureLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AzureLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
