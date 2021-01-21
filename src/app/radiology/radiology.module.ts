import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
} from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { RadiologyComponent } from './radiology.component';
import { OrderModule } from 'ngx-order-pipe';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PipelModule } from '../pipes/pipe.module';
import { RadiologyNewRequestsComponent } from './newRequests/newRequests.component';
import { RadiologyHistoryComponent } from './history/history.component';
import { unsignedReportsComponent } from './unsignedReports/unsignedReports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './../address/address.component';
import { DynamicNotesModule } from './../dyanmic-notes/dynamic.notes.module';

import { RadiologySessionComponent } from './radiologySession/radiologySession.component';
import { PacsModule } from '../pacs/pacs.module';

@NgModule({
    imports: [
        PacsModule,
        MaterialModule,
        OrderModule,
        PipelModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicNotesModule
    ],
    declarations: [
        RadiologySessionComponent,
        RadiologyComponent,
        RadiologyHistoryComponent,
        RadiologyNewRequestsComponent,
        unsignedReportsComponent
    ],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RadiologyModule {}
