import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SpecialistComponent } from './specialist/specialist.component';

import { ScheduleComponent } from './Schedule/schedule.component';
import { VideoCallComponent } from './vidyo/videocall.component';
import { PacsiosComponent } from './pacsios/pacsios.component';
import { ChatComponent } from './chat/chat.component';
import { RadiologyComponent } from './radiology/radiology.component';
import { RadiologySessionComponent } from './radiology/radiologySession/radiologySession.component';
import { EndPointsComponent } from './endpoints/endpoints.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordResetComponent } from './auth/passwordreset/passwordreset.component';
import { PasswordResetCompletionComponent } from './auth/passwordresetcompletion/passwordresetcompletion.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { VerificationComponent } from './auth/verfication/verification.component';
import { LoginGuard } from './core/services/guard/login.guard';
import { RoleGuard } from './core/services/guard/role.guard';
import { RouteAcess } from './core/services/guard/route.guard';
import { DeactivateGuardService } from './core/services/guard/deactivateGuardService.guard';
import { DynamicNotesComponent } from './dyanmic-notes/dynamic-notes-component/dynamic.notes.component';
import { AddressComponent } from './address/address.component';
import { ViewPacsComponent } from './home/viewPacs/viewPacs.component';
import { UserManagementComponent } from './userManagement/userManagement.component';
import { TokboxComponent } from './tokbox/tokbox.component';
import { SurveyComponent } from './tokbox/survey/survey.component';
import { OpdComponent } from './opd/opd.component';
import { AzureLoginComponent } from './azure/azure-login/azure-login.component';
import { AzureLogoutComponent } from './azure/azure-logout/azure-logout.component';
import { DownloadAppIosComponent } from './mobile-app/download-app-ios/download-app-ios.component';
import { VisitComponent } from './visit/visit/visit.component';
import { InviteTokboxComponent } from './visit/tokbox/tokbox.component';
import { DownloadAppAndroidComponent } from './mobile-app/download-app-android/download-app-android.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [],
        canActivate: [LoginGuard, RoleGuard]
    },
    {
        path: 'viewpacs/:mrn/:specialistRequestId',
        component: ViewPacsComponent,
        children: [],
        canActivate: [LoginGuard]
    },

    {
        path: 'home',
        component: HomeComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'radiology',
        component: RadiologyComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'radiology/session/:specialityId/:SessionId/:type',
        component: RadiologySessionComponent,
        children: []
        // canActivate: [LoginGuard,RouteAcess]
    },
    {
        path: 'radiology/session/:specialityId/:SessionId/:pageNum/:type',
        component: RadiologySessionComponent,
        children: []
        // canActivate: [LoginGuard,RouteAcess]
    },

    {
        path: 'test',
        component: AddressComponent,
        children: []
    },

    {
        path: 'pacs/:pid/:token',
        component: PacsiosComponent,
        children: [],
        canActivate: []
    },

    {
        path: 'notes/:sid/:srid/:eid',
        component: DynamicNotesComponent,
        children: [],
        canActivate: [LoginGuard]
    },
    {
        path: 'specialist',
        component: SpecialistComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'profile',
        component: UserManagementComponent,
        children: [],
        canActivate: [LoginGuard]
    },
    {
        path: 'schedule',
        component: ScheduleComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'call/:type',
        component: VideoCallComponent,
        children: [],
        canActivate: [LoginGuard],
        canDeactivate: [DeactivateGuardService]
    },
    {
        path: 'talk/:type',
        component: TokboxComponent,
        children: [],
        canActivate: [LoginGuard],
        canDeactivate: [DeactivateGuardService]
    },
    {
        path: 'messages',
        component: ChatComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'endpoints',
        component: EndPointsComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'login',
        component: LoginComponent,
        children: []
    },
    {
        path: 'reset',
        component: PasswordResetComponent,
        children: []
    },
    {
        path: 'reset/completion',
        component: PasswordResetCompletionComponent,
        children: []
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        children: []
    },
    {
        path: 'verification',
        component: VerificationComponent,
        children: [],
        canActivate: [LoginGuard],
        canDeactivate: [DeactivateGuardService]
    },
    {
        path: 'survey',
        component: SurveyComponent,
        children: [],
        canActivate: [LoginGuard],
        canDeactivate: [DeactivateGuardService]
    },
    {
        path: 'opd',
        component: OpdComponent,
        children: [],
        canActivate: [LoginGuard, RouteAcess]
    },
    {
        path: 'adlogin',
        component: AzureLoginComponent,
        children: [],
        canActivate: []
    },
    {
        path: 'adlogout',
        component: AzureLogoutComponent,
        children: [],
        canActivate: []
    },
    {
        path: 'downloadappios',
        component: DownloadAppIosComponent,
        children: [],
        canActivate: []
    },
    {
        path: 'downloadappandroid',
        component: DownloadAppAndroidComponent,
        children: [],
        canActivate: []
    },
    {
        path: 'invite/:inviteId/:passCode',
        component: VisitComponent,
        children: [],
        canActivate: [LoginGuard]
    },
    {
        path: 'invite/talk',
        component: InviteTokboxComponent,
        children: [],
        canActivate: [LoginGuard]
    },
    {
        path: 'notes/:isapt/:spid/:aid/:wid',
        component: DynamicNotesComponent,
        children: [],
        canActivate: [LoginGuard]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
