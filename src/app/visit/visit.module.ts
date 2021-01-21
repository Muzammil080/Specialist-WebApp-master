import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitComponent } from './visit/visit.component';
import { InviteTokboxComponent } from './tokbox/tokbox.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { DynamicNotesModule } from '../dyanmic-notes/dynamic.notes.module';
import { PacsModule } from '../pacs/pacs.module';
import { LabReportsModule } from '../lab-reports/lab-reports.module';
import { MatIconModule } from '@angular/material';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  imports: [
    CommonModule,
    DynamicNotesModule,
    PacsModule,
    LabReportsModule,
    MatIconModule,
    AngularDraggableModule
  ],
  declarations: [VisitComponent, InviteTokboxComponent, PublisherComponent, SubscriberComponent]
})
export class VisitModule { }
