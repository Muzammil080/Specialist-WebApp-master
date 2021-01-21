import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppIosComponent } from './download-app-ios.component';

describe('DownloadAppIosComponent', () => {
  let component: DownloadAppIosComponent;
  let fixture: ComponentFixture<DownloadAppIosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAppIosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAppIosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
