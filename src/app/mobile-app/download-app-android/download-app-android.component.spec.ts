import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppAndroidComponent } from './download-app-android.component';

describe('DownloadAppAndroidComponent', () => {
  let component: DownloadAppAndroidComponent;
  let fixture: ComponentFixture<DownloadAppAndroidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadAppAndroidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadAppAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
