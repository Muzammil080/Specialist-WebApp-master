import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadAppIosComponent } from './download-app-ios/download-app-ios.component';
import { MaterialModule } from '../material/material.module';
import { DownloadAppAndroidComponent } from './download-app-android/download-app-android.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [DownloadAppIosComponent, DownloadAppAndroidComponent]
})
export class MobileAppModule { }
