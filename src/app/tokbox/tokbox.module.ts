import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TokboxComponent } from './tokbox.component';
import { MaterialModule } from '../material/material.module';
import { DynamicNotesModule } from '../dyanmic-notes/dynamic.notes.module';
import { PacsModule } from '../pacs/pacs.module';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { OpentokService } from '../core/services/Opentok/Opentok.service';
import { SurveyComponent } from './survey/survey.component';
import { LabReportsModule } from '../lab-reports/lab-reports.module';
//import { LabReportsComponent } from '../lab-reports/lab-reports.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { NurseMessageComponent } from './nurse-message/nurse-message.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { TextMaskModule } from 'angular2-text-mask';
import { InterpreterComponent } from './invite/interpreter/interpreter.component';
import { ExternalSpecialistComponent } from './invite/external-specialist/external-specialist.component';
import { SpecialistComponent } from './invite/specialist/specialist.component';
import { OtherComponent } from './invite/other/other.component';
import { InviteAlertComponent } from './invite-alert/invite-alert.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { StrokeImagesComponent } from './stroke-images/stroke-images.component';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicNotesModule,
        PacsModule,
        MatIconModule,
        LabReportsModule,
        AngularDraggableModule,
        BrowserModule,
        TextMaskModule,
        Ng2TelInputModule
    ],
    entryComponents: [
        NurseMessageComponent,
        PatientInfoComponent,
        InterpreterComponent,
        ExternalSpecialistComponent,
        SpecialistComponent,
        OtherComponent,
        StrokeImagesComponent
    ],
    declarations: [
        TokboxComponent,
        PublisherComponent,
        SubscriberComponent,
        SurveyComponent,
        NurseMessageComponent,
        PatientInfoComponent,
        InterpreterComponent,
        ExternalSpecialistComponent,
        SpecialistComponent,
        OtherComponent,
        InviteAlertComponent,
        StrokeImagesComponent
    ],
    providers: [OpentokService]
})
export class TokboxModule { }
