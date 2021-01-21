import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import { StatusService } from '../core/services/user/status.service';
import { RequestedAppointment, Appointment } from '../core/models/appointment';
import { Accepted } from '../core/services/specialist/specialistrequests.service';
import { PatientInfo, PatientInfoService } from '../core/services/specialist/patientinfo.service';
import { UIService } from '../core/services/ui/ui.service';
import { AuthService } from '../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { OpdService } from '../core/services/opd/opd.service';
import { CountBubble } from '../core/services/specialist/countbubble.service';
import { Message } from '../core/models/message';
import { MappingService } from '../core/services/mapping/mapping.service';
import { addDays, startOfDay, endOfDay } from 'date-fns';
import { QuickAppointmentComponent } from './quick-appointment/quick-appointment.component';
import { EndpointsService } from '../core/services/endpoints/endpoints.service';

@Component({
    selector: 'app-opd',
    templateUrl: './opd.component.html',
    styleUrls: ['./opd.component.css']
})
export class OpdComponent implements OnInit, OnDestroy {
    TodaysAppointment = false;
    SearchAppointments = false;
    AppointmentHistory = false;

    requests: RequestedAppointment[];
    accepted: Accepted;
    visibilityLoginSpinner;
    visibilitysessionmessage;
    requestrefresh;
    requestrefreshsubscribe: ISubscription;
    patientInfo: PatientInfo;
    connectedSessions;
    appointments: Appointment[] = [];

    currentVirtualSessions = false;
    sessionHistory = false;
    UnsignedNotesAppointments = false;
    visibilityLoginSpinnerdata: string;
    appointmentsCount: any;
    zeroResults: string;
    currentSessionsCount: number;
    currentSessions: any[];
    Appointments: any[];

    constructor(
        private _statusService: StatusService,
        private dialog: MatDialog,
        private _uiServices: UIService,
        private _authServices: AuthService,
        private _router: Router,
        private _opdService: OpdService,
        private _countBubble: CountBubble,
        private _patientinfoservice: PatientInfoService,
        private _mappingService: MappingService,
        private _endpointsService : EndpointsService
    ) { }

    ngOnInit() {
        this._statusService.getpermissionCodes().subscribe(res => {
            if (res) {
                console.log(res,'get permission coded');
                this.TodaysAppointment = res.TodaysAppointment;
                this.SearchAppointments = res.SearchAppointments;
                this.AppointmentHistory = res.AppointmentHistory;
                this.UnsignedNotesAppointments = res.UnsignedNotesAppointments;
            }
        });

        sessionStorage.removeItem('vidyo');
        sessionStorage.removeItem('reasonForRequest');
        sessionStorage.removeItem('facilityName');
        this._opdService.issessionrequest = false;
        this.getRequests();
        // this.getAppointments();
        this.requestrefresh = Observable.interval(15000);
        this.requestrefreshsubscribe = this.requestrefresh.subscribe(ex => {
            this.getRequestswithoutspiner();
        });

        const user = this._authServices.getUser();
        if (!user) {
            return;
        }

        this.initPageTransition(user.userStatus);
    }

    getConnectedSessionCount() {
        this.connectedSessions = 0;
        for (let index = 0; index < this.requests.length; index++) {
            if (this.requests[index].currentStateName === 'Connected') {
                this.connectedSessions++;
            }
        }
    }

    getRequests() {
        this.visibilityLoginSpinner = 'block';
        this.visibilitysessionmessage = 'none';
        this.Appointments = [];
        this.zeroResults = 'none';
        // this.request = null;
        this._opdService.getAppointmentRequest().subscribe(
            response => {
                if (response.status === 200) {
                    if (response.json().length !== 0) {
                        this.requests = response.json();
                        this.requests.reverse();
                        this.getConnectedSessionCount();
                        this.getSessionsAndCount();
                        this._countBubble.SetAppointmentCount(
                            this.currentSessionsCount
                        );
                        if (this.currentSessionsCount === 0) {
                            console.log('here');
                            this.visibilitysessionmessage = 'block';
                        }else{
                            this.visibilitysessionmessage = 'none';
                        }
                        if (this.Appointments.length === 0) {
                            this.zeroResults = 'table-cell';
                        }else{
                            this.zeroResults = 'none';
                        }
                    } else {
                        this.requests = null;
                        this.visibilitysessionmessage = 'block';
                        this.zeroResults = 'table-cell';
                        this._countBubble.SetAppointmentCount(0);
                    }
                    this.visibilityLoginSpinner = 'none';
                }
            },
            error => {
                this.visibilityLoginSpinner = 'none';
            }
        );
    }
    getSessionsAndCount() {
        this.currentSessionsCount = 0;
        this.currentSessions = [];
        this.Appointments = [];
        for (let index = 0; index < this.requests.length; index++) {
            if (
                this.requests[index].currentStateName === 'Connected' ||
                this.requests[index].currentStateName === 'SessionRequested'
            ) {
                this.currentSessionsCount++;
                this.currentSessions.push(this.requests[index]);
            } else {
                console.log(this.requests,'requests');
                this.requests[index].startDate = new Date(this.requests[index].startDate + 'Z');
                this.requests[index].endDate = new Date(this.requests[index].endDate + 'Z');
                this.Appointments.push(this.requests[index]);
            }
        }
    }

    getRequestswithoutspiner() {
        this._opdService.getAppointmentRequest().subscribe(
            response => {
                if (response.status === 200) {
                    if (response.json().length !== 0) {
                        this.visibilitysessionmessage = 'none';
                        this.requests = response.json();
                        this.requests.reverse();
                        this.getConnectedSessionCount();
                        this.getSessionsAndCount();
                        this._countBubble.SetAppointmentCount(
                            this.currentSessionsCount
                        );
                        if (this.currentSessionsCount === 0) {
                            this.visibilitysessionmessage = 'block';
                        }else{
                            this.visibilitysessionmessage = 'none';
                        }
                        if (this.Appointments.length === 0) {
                            this.zeroResults = 'table-cell';
                        }else{
                            this.zeroResults = 'none';
                        }
                    } else {
                        this.requests = null;
                        this.visibilitysessionmessage = 'block';
                        this.zeroResults = 'table-cell';
                        this._countBubble.SetAppointmentCount(0);
                    }
                }
            },
            error => { }
        );
    }

    setRequests(id, action, result, workflowInstanceId) {
        this.visibilityLoginSpinner = 'block';
        this.visibilitysessionmessage = 'none';
        // this.request = null;

        if (action === 'Reconnect') {
            this._opdService.GetSessionInfo(id).subscribe(
                response => {
                    if (response.status === 200) {
                        if (response) {
                            const body = response.json();
                            this.accepted = this._mappingService.mapAcceptedRequest(
                                body
                            );
                            sessionStorage.setItem(
                                'vidyo',
                                JSON.stringify(this.accepted)
                            );
                            sessionStorage.setItem('appointmentId', id);
                            sessionStorage.setItem('workflowInstanceId', workflowInstanceId);
                            if (result === 'Kart') {
                                if (
                                    this.accepted.platform.toLowerCase() ===
                                    'tokbox'
                                ) {
                                    this._router.navigate(['/talk/session']);
                                } else {
                                    this._router.navigate(['/call/session']);
                                }
                            } else {
                                sessionStorage.setItem(
                                    'facilityName',
                                    body.facilityName
                                );
                                sessionStorage.setItem(
                                    'endPoint',
                                    body.serialNumber
                                );

                                sessionStorage.setItem(
                                    'endpointFacilityName',
                                    body.facilityName
                                );
                                sessionStorage.setItem(
                                    'endpointSerialNumber',
                                    body.serialNumber
                                );

                                if (
                                    this.accepted.platform.toLowerCase() ===
                                    'tokbox'
                                ) {
                                    this._router.navigate(['/talk/endpoint']);
                                } else {
                                    this._router.navigate(['/call/endpoint']);
                                }
                            }
                        }
                    }
                    this.getRequests();
                },
                error => {
                    this.getRequests();
                    document.getElementById('call-connecting').style.display =
                        'none';
                    const msg = new Message();
                    msg.msg = 'Something went wrong, please try again.';
                    this._uiServices.showToast(msg);
                    this.visibilityLoginSpinner = 'none';
                }
            );
        } else {
            this._opdService.AcceptSessionRequest(id).subscribe(
                response => {
                    if (response.status === 200 && action === 'Accepted') {
                        if (response) {
                            this.accepted = response.json();
                            sessionStorage.setItem(
                                'vidyo',
                                JSON.stringify(this.accepted)
                            );
                            sessionStorage.setItem('appointmentId', id);
                            sessionStorage.setItem('workflowInstanceId', workflowInstanceId);
                            if (
                                this.accepted.platform.toLowerCase() ===
                                'tokbox'
                            ) {
                                this._router.navigate(['/talk/session']);
                            } else {
                                this._router.navigate(['/call/session']);
                            }
                        }
                    }
                    this.getRequests();
                },
                error => {
                    this.getRequests();
                    document.getElementById('call-connecting').style.display =
                        'none';
                    const msg = new Message();
                    msg.msg = 'Something went wrong, please try again.';
                    this._uiServices.showToast(msg);
                    this.visibilityLoginSpinner = 'none';
                }
            );
        }
    }

    callAccept(
        id,
        facilityName,
        reasonForRequest,
        specialityName,
        endPoint,
        endPointId,
        workflowInstanceId
    ) {
        sessionStorage.setItem('isDirectCall', "false");
        document.getElementById('call-connecting').style.display = 'block';
        this._patientinfoservice.isrefreshed = true;
        this._opdService.issessionrequest = true;
        sessionStorage.setItem('facilityName', facilityName);
        sessionStorage.setItem('specialityName', specialityName);
        sessionStorage.setItem('reasonForRequest', reasonForRequest);
        sessionStorage.setItem('endPoint', endPoint);
        sessionStorage.setItem('endPointId', endPointId);

        this.setRequests(id, 'Accepted', 'Kart', workflowInstanceId);
    }

    callEnd(id) {
        this._opdService.EndSession(id).subscribe(res => {
            if (res.status === 200) {
                this.getRequests();
            }
        });
    }

    callReconnect(
        id,
        connectionFrom,
        facilityName,
        reasonForRequest,
        specialityName,
        endPoint,
        endPointId,
        workflowInstanceId
    ) {
        document.getElementById('call-connecting').style.display = 'block';
        this._patientinfoservice.isrefreshed = true;
        this._opdService.issessionrequest = true;
        sessionStorage.setItem('facilityName', facilityName);
        sessionStorage.setItem('specialityName', specialityName);
        sessionStorage.setItem('reasonForRequest', reasonForRequest);
        sessionStorage.setItem('endPoint', endPoint);
        sessionStorage.setItem('endPointId', endPointId);
        this.setRequests(id, 'Reconnect', 'Kart', workflowInstanceId);
    }

    ngOnDestroy() {
        this.dialog.closeAll();
        this.requestrefreshsubscribe.unsubscribe();
    }

    private initPageTransition(status: string) {
        if (
            status.toLowerCase() === 'init' ||
            status.toLowerCase() === 'verified'
        ) {
            this._router.navigate(['verification']);
        }
    }
    getUTCDate(date: any) {
        return new Date(date + 'Z');
    }

    cancelAppointment(id: number) {
        this._opdService.cancelAppointment(id).subscribe(ex => {
            this.getRequestswithoutspiner();
        });
    }

    addQuickAppointment(){
        let dialogRef: MatDialogRef<QuickAppointmentComponent>;
        dialogRef = this.dialog.open(QuickAppointmentComponent, {panelClass: 'quickApptDialog'});
        dialogRef.afterClosed().subscribe(
            (result) => {
                console.log(result);

            }
        );
    }
}
