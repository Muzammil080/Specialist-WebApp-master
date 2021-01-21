import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './material/material.module';
import { PipelModule } from './pipes/pipe.module';
import { SharedModule } from './shared/shared.module';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { SpecialistModule } from './specialist/specialist.module';
import { UserManagementModule } from './userManagement/userManagement.module';
import { ScheduleModule } from './Schedule/schedule.module';
import { AuthModule } from './auth/auth.module';
import { VideoCallModule } from './vidyo/videocall.module';
import { PacsiosModule } from './pacsios/pacsios.module';
import { EndPointsModule } from './endpoints/endpoints.module';
import { ChatModule } from './chat/chat.module';
import { RadiologyModule } from './radiology/radiology.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ResponsiveModule } from 'ng2-responsive';
import { InputTrimModule } from 'ng2-trim-directive';
// import { UserIdleModule } from 'angular-user-idle';
// import { NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { OrderModule } from 'ngx-order-pipe';
//test

import { DynamicNotesModule } from './dyanmic-notes/dynamic.notes.module';
import { PacsModule } from './pacs/pacs.module';
import { TokboxModule } from './tokbox/tokbox.module';
import { OpdModule } from './opd/opd.module';
import { SimplePdfViewerModule } from './simplePdfViewer/simplePdfViewer.module';
import { AzureModule } from './azure/azure.module';
import { MobileAppModule } from './mobile-app/mobile-app.module';
import { VisitModule } from './visit/visit.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        SimplePdfViewerModule,
        PacsModule,
        CoreModule,
        MalihuScrollbarModule.forRoot(),
        InputTrimModule,
        BrowserModule,
        MaterialModule,
        PipelModule,
        AppRoutingModule,
        SharedModule,
        HomeModule,
        SpecialistModule,
        UserManagementModule,
        ScheduleModule,
        AuthModule,
        VideoCallModule,
        TokboxModule,
        PacsiosModule,
        ChatModule,
        RadiologyModule,
        EndPointsModule,
        TextMaskModule,
        ResponsiveModule,
        FormsModule,
        ReactiveFormsModule,
        DynamicNotesModule,
        OrderModule,
        OpdModule,
        AzureModule,
        MobileAppModule,
        VisitModule

        // NgbCollapseModule,
        // UserIdleModule.forRoot({idle: 600, timeout: 5, ping: 5})
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
