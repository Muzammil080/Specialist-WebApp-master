import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpModule } from '@angular/http';
import { LogService } from './services/log/log.service';
import { AuthService } from './services/auth/auth.service';
import { HttpService } from './services/base/http.service';
import { RoutingInfoService } from './services/routInfo/route.info.service';
import { UIService } from './services/ui/ui.service';
import { GeoLocationService } from './services/location/geo-location.service';
import { SpecialistService } from './services/specialist/specialist.service';
import { RadiologyService } from './services/radiology/radiology.service';
import { SpecialistRequestService } from './services/specialist/specialistrequests.service';
import { SpecialistScheduleService } from './services/specialist/specialistschedule.service';
import { MessageService } from './services/specialist/message.service';
import { PatientInfoService } from './services/specialist/patientinfo.service';
import { CountBubble } from './services/specialist/countbubble.service';
import { StatusService } from '../core/services/user/status.service';
import { SignalRService } from '../core/services/signalr/signalr.service';
import { PassChangeService } from '../core/services/user/pass-change.service';
import { LoginGuard } from '../core/services/guard/login.guard';
import { RoleGuard } from '../core/services/guard/role.guard';
import { RouteAcess } from '../core/services/guard/route.guard';
import { DeactivateGuardService } from '../core/services/guard/deactivateGuardService.guard';
import { RouteService } from '../core/services/guard/route.service';
import { SecureQuestionsService } from '../core/services/user/secure-questions.service';
import { Pacs } from './main';
import { ViewInstance } from './viewInstance';
import { ChatService } from './services/specialist/chat.service';
import { MappingService } from './services/mapping/mapping.service';
import { OpdService } from './services/opd/opd.service';
import { UtilityService } from './services/general/utility.service';
import { VersionCheckService } from './services/version-check.service';
import { SurveyService } from './services/survey/survey.service';
import { PartnersiteService } from './services/partnersite/partnersite.services';
import { AppointmentHistoryServices } from './services/appointment/appointment-history.services';
import { NurseMessageService } from './services/nurse/nurse.message.services';
import { AppointmentService } from './services/appointment/appointment.services';

@NgModule({
    imports: [HttpModule],
    providers: [
        { provide: 'ILogService', useClass: LogService },
        { provide: 'IAuthService', useClass: AuthService },
        UIService,
        Pacs,
        ViewInstance,
        HttpService,
        PassChangeService,
        RoutingInfoService,
        GeoLocationService,
        SpecialistService,
        RadiologyService,
        StatusService,
        SignalRService,
        ChatService,
        SecureQuestionsService,
        SpecialistRequestService,
        SpecialistScheduleService,
        MappingService,
        MessageService,
        CountBubble,
        PatientInfoService,
        LoginGuard,
        RoleGuard,
        RouteAcess,
        DeactivateGuardService,
        RouteService,
        OpdService,
        UtilityService,
        VersionCheckService,
        SurveyService,
        PartnersiteService,
        AppointmentHistoryServices,
        NurseMessageService,
        AppointmentService
    ],
    declarations: [],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule { }
