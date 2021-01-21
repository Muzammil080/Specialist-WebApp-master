import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpdComponent } from './opd.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipelModule } from '../pipes/pipe.module';
import { AppointmentHistoryComponent } from './appointment-history/appointment-history.component';
import { QuickAppointmentComponent } from './quick-appointment/quick-appointment.component';
import { TextMaskModule } from 'angular2-text-mask';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { NotesComponent } from './notes/notes.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        PipelModule,
        TextMaskModule,
        Ng2TelInputModule
    ],
    entryComponents: [QuickAppointmentComponent],
    declarations: [OpdComponent, MyAppointmentsComponent, AppointmentHistoryComponent, QuickAppointmentComponent, NotesComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OpdModule {}
