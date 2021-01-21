import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureLogoutComponent } from './azure-logout.component';

describe('AzureLogoutComponent', () => {
  let component: AzureLogoutComponent;
  let fixture: ComponentFixture<AzureLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AzureLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AzureLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
