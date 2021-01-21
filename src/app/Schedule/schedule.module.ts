import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule.component';
import { CalenderComponent } from './schedule-calender/calender.component';
import { CalenderMyscheduleComponent } from './schedule-calender/calender.myschedule.component';
import { CalendarHeaderComponent } from './schedule-calender/calender-utils/calender-header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { MomentModule } from 'angular2-moment';
import { OpdScheduleComponent } from './opd-schedule/opd-schedule.component';
import { OpdAvailabilityComponent } from './opd-availability/opd-availability.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { OpdDialogueComponent } from './opd-availability/opd-dialogue/opd-dialogue.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

// import { MomentTimezoneModule } from 'angular-moment-timezone';

@NgModule({
    imports: [
        MaterialModule,
        FormsModule,
        MomentModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        MalihuScrollbarModule.forRoot()
    ],
    entryComponents: [OpdDialogueComponent],
    declarations: [
        ScheduleComponent,
        CalenderComponent,
        CalenderMyscheduleComponent,
        CalendarHeaderComponent,
        OpdAvailabilityComponent,
        OpdScheduleComponent,
        OpdDialogueComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ScheduleModule {}
