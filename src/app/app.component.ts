import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth/auth.service';

import { Observable } from 'rxjs/Rx';
import { CountBubble } from './core/services/specialist/countbubble.service';
import { MessageService } from './core/services/specialist/message.service';
import { SpecialistRequestService } from './core/services/specialist/specialistrequests.service';
import { ISubscription } from 'rxjs/Subscription';
import { Idle } from 'idlejs/dist';
import {
    StatusService,
    Roles,
    childcomponnet,
    parentcomponnet
} from './core/services/user/status.service';
import { SignalRService } from './core/services/signalr/signalr.service';
import { User } from './core/models/user';
import { Specialist } from './core/models/specialist.model';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { environment } from '../environments/environment';
// import { UserIdleService } from 'angular-user-idle';
// with predefined events on `document`
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { OpdService } from './core/services/opd/opd.service';
import { VersionCheckService } from './core/services/version-check.service';
import { ChatService } from './core/services/specialist/chat.service';
import { InviteService } from './core/services/invites/invite.service';

declare function checkinternet(): any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    // title = 'app';
    user: User;
    userspecilist: Specialist = new Specialist();
    isLoggedIn;
    // isCollapsed;
    urlpath: boolean = true;
    Fullname;
    Employer;
    SessionCount = 0;
    MessageCount = 0;
    EndpointCount = 0;
    AppointmentCount = 0;
    TwilioMsgCount = 0;
    requestrefreshmsgcount;
    requestrefreshsubscribemsgcount: ISubscription;
    initals;
    idle;

    UserRoles: Roles[];
    UserRolespermissionCode: string[] = [];

    Session;
    Messages;
    Schedule;
    Endpoints;
    Specialist;
    Radiology;
    OPD: boolean;

    InHome = true;
    isSpecialist = false;
    childcomponnet: childcomponnet = new childcomponnet();
    parentcomponnet: parentcomponnet = new parentcomponnet();
    sessionCountInterval;
    pendingInvitesCount = 0;
    constructor(
        private _signalRService: SignalRService,
        private mScrollbarService: MalihuScrollbarService,
        private _specialistRequestService: SpecialistRequestService,
        private _statusService: StatusService,
        private _messageService: MessageService,
        private _authServices: AuthService,
        private _router: Router,
        private _countBubble: CountBubble,
        private _opdService: OpdService,
        private _versionCheckService: VersionCheckService,
        private _chatService: ChatService,
        private _inviteService : InviteService
    ) { }

    logout() {
        if(this.user.userType.toLowerCase() != 'ad'){
            this._authServices.logoutUser();
        }else{
            this._authServices.azurelogout();
        }

    }

    setTitle(Fname, Lname, Emp) {
        this.Fullname = Lname + ', ' + Fname[0];
        sessionStorage.setItem('userName', this.Fullname);
        this.Employer = Emp;
        this.initals = Lname[0].toUpperCase();
    }

    getSpecilistinfo() {
        this._statusService.getSpecialistInfo().subscribe(
            response => {
                if (response) {
                    this.userspecilist = JSON.parse(response._body);
                    sessionStorage.setItem('specialityName',this.userspecilist.specialityName);
                    this._statusService.setSpecilistInfo(this.userspecilist);
                }
            },
            error => {
                this.userspecilist = null;
                this._statusService.setSpecilistInfo(this.userspecilist);
            }
        );
    }
    getUser() {
        //this.getSpecilistinfo();

        this._statusService.getUserInfo().subscribe(
            response => {
                if (response) {
                    this.user = response;

                    this.isSpecialist = this.user.isSpecialist;
                    if (this.user.isSpecialist) {
                        this.getSpecilistinfo();
                    }

                    this.resetroles();

                    if (
                        this.user.userStatus == 'Completed' ||
                        this.user.userStatus == 'PendingForApproval'
                    ) {
                        this.getRole();
                    } else if (
                        this.user.userStatus == 'Init' ||
                        this.user.userStatus == 'Verified'
                    ) {
                        this._router.navigate(['/verification']);
                    }

                    this.setTitle(
                        this.user.firstName,
                        this.user.lastName,
                        this.user.employer
                    );
                }
            },
            error => { }
        );

        this._statusService.getStatus().subscribe(
            response => {
                this.user = JSON.parse(response._body);
                this._statusService.setUserInfo(this.user);
                this.setTitle(
                    this.user.firstName,
                    this.user.lastName,
                    this.user.employer
                );
                console.log(this.user,"user");
                sessionStorage.setItem('userFullName',this.user.firstName + ' ' + this.user.lastName);
                sessionStorage.setItem('partnerSiteId' , this.user.partnerSiteId.toString());
            },
            error => {
                // this._authServices.logoutUser();
            }
        );
    }

    resetroles() {
        this.UserRoles = null;
        this.UserRolespermissionCode = [];
        this.Session = false;
        this.Messages = false;
        this.Radiology = false;
        this.Schedule = false;
        this.Endpoints = false;
        this.Specialist = false;
        this.OPD = false;

        this.parentcomponnet.Session = false;
        this.parentcomponnet.Messages = false;
        this.parentcomponnet.Radiology = false;
        this.parentcomponnet.Schedule = false;
        this.parentcomponnet.Endpoints = false;
        this.parentcomponnet.Specialist = false;
        this.parentcomponnet.profile = false;
        this.parentcomponnet.Opd = false;

        this.childcomponnet.CurrentVirtualSessions = false;
        this.childcomponnet.SessionHistory = false;
        this.childcomponnet.ViewSchedule = false;
        this.childcomponnet.MarkOffDays = false;
        this.childcomponnet.DeferredMsgs = false;
        this.childcomponnet.Chat = false;
        this.childcomponnet.OpdAvaialbility = false;
        this.childcomponnet.SearchAppointments = false;
        this.childcomponnet.TodaysAppointment = false;
        this.childcomponnet.ViewOpdSchedule = false;
        this.childcomponnet.AppointmentHistory = false;
        this.childcomponnet.UnsignedNotesAppointments = false;

        this._statusService.setpermissionCodesParent(this.parentcomponnet);
        this._statusService.setpermissionCodes(this.childcomponnet);
    }
    getRole() {
        this._statusService.getRole().subscribe(
            response => {
                this.UserRoles = JSON.parse(response._body);
                var i = 0;
                for (var index = 0; index < this.UserRoles.length; index++) {
                    for (
                        var index2 = 0;
                        index2 < this.UserRoles[index].permissions.length;
                        index2++
                    ) {
                        this.UserRolespermissionCode[i] = this.UserRoles[
                            index
                        ].permissions[index2].permissionCode;
                        i++;
                    }
                }

                for (
                    var index = 0;
                    index < this.UserRolespermissionCode.length;
                    index++
                ) {
                    if (
                        this.UserRolespermissionCode[index] ==
                        'PendingSession' ||
                        this.UserRolespermissionCode[index] == 'SessionHistory'
                    ) {
                        this.Session = true;
                        this.parentcomponnet.Session = true;

                        if (
                            this.UserRolespermissionCode[index] ==
                            'PendingSession'
                        ) {
                            this.childcomponnet.CurrentVirtualSessions = true;
                        }
                        if (
                            this.UserRolespermissionCode[index] ==
                            'SessionHistory'
                        ) {
                            this.childcomponnet.SessionHistory = true;
                        }
                    }
                    if (
                        this.UserRolespermissionCode[index] == 'DeferredMsgs' ||
                        this.UserRolespermissionCode[index] == 'Chat'
                    ) {
                        this.Messages = true;
                        this.parentcomponnet.Messages = true;

                        if (
                            this.UserRolespermissionCode[index] ==
                            'DeferredMsgs'
                        ) {
                            this.childcomponnet.DeferredMsgs = true;
                        }
                        if (this.UserRolespermissionCode[index] == 'Chat') {
                            this.childcomponnet.Chat = true;
                        }
                    }
                    if (
                        this.UserRolespermissionCode[index] == 'ViewSchedule' ||
                        this.UserRolespermissionCode[index] == 'MarkOffDays' ||
                        this.UserRolespermissionCode[index] ==
                        'OpdAvaialbility' ||
                        this.UserRolespermissionCode[index] == 'ViewOpdSchedule'
                    ) {
                        this.Schedule = true;
                        this.parentcomponnet.Schedule = true;

                        if (
                            this.UserRolespermissionCode[index] ==
                            'ViewSchedule'
                        ) {
                            this.childcomponnet.ViewSchedule = true;
                        }
                        if (
                            this.UserRolespermissionCode[index] == 'MarkOffDays'
                        ) {
                            this.childcomponnet.MarkOffDays = true;
                        }
                        if (
                            this.UserRolespermissionCode[index] ==
                            'OpdAvaialbility'
                        ) {
                            this.childcomponnet.OpdAvaialbility = true;
                        }
                        if (
                            this.UserRolespermissionCode[index] ==
                            'ViewOpdSchedule'
                        ) {
                            this.childcomponnet.ViewOpdSchedule = true;
                        }
                    }


                    if (
                        this.UserRolespermissionCode[index] === 'TodaysAppointment' ||
                        this.UserRolespermissionCode[index] === 'SearchAppointments' ||
                        this.UserRolespermissionCode[index] === 'AppointmentHistory') {
                        this.OPD = true;
                        this.parentcomponnet.Opd = true;
                    }
                    if (
                        this.UserRolespermissionCode[index] === 'TodaysAppointment'
                    ) {
                        this.childcomponnet.TodaysAppointment = true;
                    }
                    if (
                        this.UserRolespermissionCode[index] === 'SearchAppointments'
                    ) {
                        this.childcomponnet.SearchAppointments = true;
                    }
                    if (
                        this.UserRolespermissionCode[index] === 'AppointmentHistory'
                    ) {
                        this.childcomponnet.AppointmentHistory = true;
                    }
                    if (
                        this.UserRolespermissionCode[index] === 'UnsignedNotesAppointments'
                    ) {
                        this.childcomponnet.UnsignedNotesAppointments = true;
                    }



                    if (this.UserRolespermissionCode[index] == 'EndPoints') {
                        this.Endpoints = true;
                        this.parentcomponnet.Endpoints = true;
                    }
                    if (this.UserRolespermissionCode[index] == 'Radiology') {
                        this.Radiology = true;
                        this.parentcomponnet.Radiology = true;
                    }

                    // As per requested Removing specialists Tab

                    // if (
                    //     this.UserRolespermissionCode[index] ==
                    //     'SearchSpecialist'
                    // ) {
                    //     this.Specialist = true;
                    //     this.parentcomponnet.Specialist = true;
                    // }
                }

                this.parentcomponnet.profile = true;
                this._statusService.pagewasreloaded = false;
                this._statusService.setpermissionCodesParent(
                    this.parentcomponnet
                );
                this._statusService.setpermissionCodes(this.childcomponnet);
                // localStorage.setItem("roles_web" , JSON.stringify(this.UserRolespermissionCode));
            },
            error => {
                // this._authServices.logoutUser();
            }
        );
    }

    getMsgCount() {
        if (this.isSpecialist) {
            this._messageService.getMsgCount().subscribe(
                response => {
                    if (response.status == 200) {
                        if (isNaN(response._body)) {
                            this.MessageCount = 0;
                            this.MessageCount += this.TwilioMsgCount;
                        } else {
                            this.MessageCount = JSON.parse(response._body);
                            this.MessageCount += this.TwilioMsgCount;
                        }
                    }
                },
                error => {
                    this.MessageCount = 0;
                    this.MessageCount += this.TwilioMsgCount;
                }
            );

            // this.MessageCount += this._chatService.GetUnconsumedMsgs();

        }
    }

    getsessioncount() {
        if (this.isSpecialist) {
            this._specialistRequestService
                .getSpecialistRequestcount()
                .subscribe(
                    response => {
                        if (response.status == 200) {
                            if (isNaN(response._body)) {
                                this.SessionCount = 0;
                            } else {
                                this.SessionCount = JSON.parse(response._body);
                            }
                        }
                    },
                    error => {
                        this.SessionCount = 0;
                    }
                );
        }
    }

    GetAppointmentcount() {
        if (this.isSpecialist && this.OPD) {
            this._opdService.getAppointmentRequest().subscribe(
                response => {
                    if (response.status === 200) {
                        if (response.json()) {
                            let resp = response.json();
                            let currentSessionsCount = 0;
                            for (let index = 0; index < resp.length; index++) {
                                if (
                                    resp[index].currentStateName ===
                                    'Connected' ||
                                    resp[index].currentStateName ===
                                    'SessionRequested'
                                ) {
                                    currentSessionsCount++;
                                }
                            }

                            this.AppointmentCount = currentSessionsCount;
                        }
                    }
                },
                error => {
                    this.AppointmentCount = 0;
                }
            );
        }
    }

    public handleInactivityCallback() {
        // Sign out current user or display specific message regarding inactivity
    }

    connectionR() {
        let token = this._authServices.getToken();
        this._signalRService.hubConnection = new HubConnectionBuilder()
            .withUrl(
                environment.hubConnection +
                'signalr/?token=' +
                token +
                '&connectiontype=user'
            )
            // .configureLogging(LogLevel.Debug)
            // .withHubProtocol(new MessagePackHubProtocol())
            .build();
        this._signalRService.hubConnection
            .start()
            .then(() => {
                this._signalRService.hubConnection.onclose(err => {
                    if (err) {
                        setTimeout(() => {
                            this.connectionR();
                        }, 1000);
                    } else {
                    }
                });

                this._signalRService.ishubConnection = true;
            })
            .catch(err => {
                setTimeout(() => {
                    this.connectionR();
                }, 10000);
                this._signalRService.ishubConnection = false;
            });
    }

    stopConnectionR() {
        if (this._signalRService.hubConnection) {
            this._signalRService.hubConnection.stop();
        }
    }

    ngOnDestroy() {
        // alert("hi");
        clearInterval(this.sessionCountInterval);
    }
    cleartab() {
        if (document.getElementsByClassName('nav-link')) {
            for (
                var index = 0;
                index < document.getElementsByClassName('nav-link').length;
                index++
            ) {
                document
                    .getElementsByClassName('nav-link')
                [index].classList.remove('selectedtab');
            }
        }
    }

    refresTokenWithExpire() {
        if (sessionStorage.getItem('token_expiry_web')) {
            var dateNow = new Date();
            var dateExpire = parseInt(
                sessionStorage.getItem('token_expiry_web')
            );
            var checkTime = dateExpire - dateNow.getTime() - 600000;

            setTimeout(() => {
                this._authServices.refreshToken().subscribe(
                    res => {
                        this._authServices.SaveToken(res);
                        setTimeout(() => {
                            this.refresTokenWithExpire();
                        }, 5000);
                    },
                    err => {
                        setTimeout(() => {
                            this.refresTokenWithExpire();
                        }, 5000);
                    }
                );
            }, Math.round(checkTime));
        }
    }

    ngOnInit() {


        // alert("hi2");



        this._chatService.totalMsg.subscribe(
            (totalMsgCount) => {
                this.MessageCount -= this.TwilioMsgCount;
                this.TwilioMsgCount = totalMsgCount;
                this.MessageCount += totalMsgCount;
            }
        );


        this._versionCheckService.initVersionCheck('appversion/veedoc');
        let firstime = true;
        let firstimecheckint = true;
        this.requestrefreshmsgcount = Observable.interval(30000);
        this.requestrefreshsubscribemsgcount = this.requestrefreshmsgcount.subscribe(
            ex => {
                if (this.isLoggedIn) {



                    if (firstimecheckint) {
                        checkinternet();
                        firstimecheckint = false;
                    }

                    if (firstime) {
                        this.idle = new Idle()
                            .whenNotInteractive()
                            .within(10)
                            .do(() => {
                                if (this.urlpath == true) {
                                    firstime = false;
                                    console.log(this.user, "user");
                                    if(this.user.userType.toLowerCase() != 'ad'){
                                        this._authServices.logoutUser();
                                    }else{
                                        this._authServices.azurelogout();
                                    }

                                } else {
                                    firstime = true;
                                }
                            })
                            .start();
                    }

                    this.getMsgCount();
                    this.GetAppointmentcount();
                    //this.getPendingInvitesCount();

                    if (!this.InHome) {
                        //this.getsessioncount();
                        this.getPendingInvitesCount();
                    }
                }
            }
        );

        this._countBubble.getsessioncount().subscribe(count => {
            this.SessionCount = count;
        });

        this._countBubble.GetAppointmentsCount().subscribe(count => {
            this.AppointmentCount = count;
        });

        this._router.events.startWith().subscribe((url: any) => {
            this.cleartab();
            // for (var index = 0; index < document.getElementsByClassName("nav-link").length; index++) {

            // if (this._router.url.toString() == document.getElementsByClassName("nav-link")[index].id) {
            if (document.getElementById(this._router.url.toString())) {
                document
                    .getElementById(this._router.url.toString())
                    .classList.add('selectedtab');
            } else {
                setInterval(() => {
                    if (document.getElementById(this._router.url.toString())) {
                        document
                            .getElementById(this._router.url.toString())
                            .classList.add('selectedtab');
                    }
                }, 500);
            }

            if (
                this._router.url.toString() == '/call/session' ||
                this._router.url.toString() == '/call/endpoint' ||
                this._router.url.toString() == '/talk/session' ||
                this._router.url.toString() == '/talk/endpoint' ||
                this._router.url.toString() == '/verification' ||
                this._router.url.toString() == '/login' ||
                this._router.url.toString() == '/registration' ||
                this._router.url.toString() == '/reset/completion' ||
                this._router.url.startsWith('/radiology/session') ||
                this._router.url.startsWith('/viewpacs/')         ||
                this._router.url.startsWith('/adlogin') ||
                this._router.url.startsWith('/adlogout') ||
                this._router.url.startsWith('/downloadappios') ||
                this._router.url.startsWith('/invite')
            ) {
                this.urlpath = false;
                this.mScrollbarService.destroy(document.body);
                document.documentElement.style.overflow = 'hidden';
                document
                    .getElementsByTagName('BODY')[0]
                    .classList.remove('body');
            } else {
                this.urlpath = true;
                this.mScrollbarService.initScrollbar(document.body, {
                    axis: 'y',
                    theme: 'minimal-dark'
                });
                document.documentElement.style.overflow = 'auto';
                document.getElementsByTagName('BODY')[0].classList.add('body');
            }

            if (this._router.url.toString() == '/home') {
                this.InHome = true;
            } else {
                this.InHome = false;
            }
        });

        this.isLoggedIn = this._authServices.checkToken();

        if (this.isLoggedIn) {
            this.getUser();
            this.connectionR();
            this._chatService.getSubscribedChannels();
            // this.getRole();
            this.refresTokenWithExpire();
        } else {
            this.stopConnectionR();
        }
        //   setTimeout(() => { this._authServices.checkToken(); },5000);
        this._authServices.loginStatusChanged.subscribe(IsLoggedIn => {
            //   setTimeout(() => { this._authServices.checkToken(); },5000);

            this.isLoggedIn = IsLoggedIn;
            if (this.isLoggedIn) {
                this.getUser();
                this.connectionR();
                this._chatService.getSubscribedChannels();
                // this.getRole();
                this.refresTokenWithExpire();
            } else {
                this.stopConnectionR();
                this._chatService.stopService();
            }
        });
        this.sessionCountInterval = setInterval(()=>{
            if(!this.InHome){
                this.getsessioncount();
            }

        },1000 * 10);
    }

    getPendingInvitesCount(){
        this._inviteService.getPendingInvitesCount().subscribe(res=>{
            this.pendingInvitesCount = JSON.parse(res._body);
        })
    }
}
