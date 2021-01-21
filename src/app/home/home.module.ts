import {
    NgModule,
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
} from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { HomeComponent } from './home.component';
import { OrderModule } from 'ngx-order-pipe';
//import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PipelModule } from '../pipes/pipe.module';
import { SessionHistoryComponent } from '../home/sessionHistory/sessionhistory.component';
import { NotesComponent } from './notes/notes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressComponent } from './../address/address.component';
import { DynamicNotesModule } from './../dyanmic-notes/dynamic.notes.module';
import { ViewPacsDialogComponent } from './viewPacs/viewPacsDialog.component';
import { ViewPacsComponent } from './viewPacs/viewPacs.component';
import { PacsModule } from '../pacs/pacs.module';
import { DeferChatModule } from '../deferchat/deferChat.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { PendingInvitesComponent } from './pending-invites/pending-invites.component';

@NgModule({
    imports: [
        DeferChatModule,
        PacsModule,
        MaterialModule,
        OrderModule,
        PipelModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicNotesModule,
        MalihuScrollbarModule
    ],
    declarations: [
        HomeComponent,
        SessionHistoryComponent,
        NotesComponent,
        ViewPacsDialogComponent,
        ViewPacsComponent,
        PendingInvitesComponent
    ],
    entryComponents: [ViewPacsDialogComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }
