import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabReportsComponent } from './lab-reports.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
  imports: [CommonModule, MalihuScrollbarModule],
  exports: [LabReportsComponent],
  declarations: [LabReportsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LabReportsModule {}
