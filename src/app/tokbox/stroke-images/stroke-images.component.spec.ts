import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeImagesComponent } from './stroke-images.component';

describe('StrokeImagesComponent', () => {
  let component: StrokeImagesComponent;
  let fixture: ComponentFixture<StrokeImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrokeImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokeImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
