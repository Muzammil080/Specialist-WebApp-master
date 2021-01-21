import { Component, OnInit, Inject, OnDestroy, AfterViewChecked, AfterViewInit } from '@angular/core'
import { UIService } from "../../core/services/ui/ui.service";
import { Message } from "../../core/models/message";
import { AuthService } from '../../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { PatientInfoService, PatientInfo } from "../../core/services/specialist/patientinfo.service";
// import { Accepted } from "../core/services/specialist/specialistrequests.service";
import { Pacs } from '../../core/main';
import { SpecialistRequestService } from "../../core/services/specialist/specialistrequests.service";
import { MatDialogRef, MatDialog } from "@angular/material";
import { Observable } from 'rxjs/Rx';
import { RouteService } from '../../core/services/guard/route.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SignalRService } from '../../core/services/signalr/signalr.service';
import { StatusService } from '../../core/services/user/status.service';
import { environment } from './../../../environments/environment';
import { RadiologyService, RadiologyRequests } from './../../core/services/radiology/radiology.service';
import { ISubscription } from 'rxjs/Subscription';
declare function disconnectCall(): any;
// declare function previewshow(): any;
// declare function previewhide(): any;
declare function joinViaBrowser(): any;
declare var $;
declare var mouseeventblock;
declare var vidyoConnector;
declare var buffer;

@Component({
    selector: 'radiology-session',
    moduleId: module.id,
    templateUrl: 'radiologySession.component.html',
    styleUrls: ['radiologySession.component.css']
})
export class RadiologySessionComponent implements OnInit, OnDestroy {

    dynamicNotesData;
    request: RadiologyRequests;
    stopinterval: boolean = false;
    pageNum: number = 0;
    showLoader: boolean = true;
    showPacs: boolean = true;
    pacsDeleted: boolean = false;
    requestrefresh;
    requestrefreshsubscribe: ISubscription;
    constructor(private _radiologyService: RadiologyService, private _statusService: StatusService, private _signalRService: SignalRService, private location: Location, private _routeService: RouteService, private dialog: MatDialog, private _specialistRequestService: SpecialistRequestService, private viewer: Pacs, private _uiService: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _patientinfoservice: PatientInfoService) {

    }


    refresh() {
        console.log('refresh called from radiology session');
        this.showPacs = false;
        this.showLoader = true;

        setTimeout(() => {
            this.showPacs = true;
            this.showLoader = true;
            this.getPacs();
        }, 1000);
    }

    ngOnInit(): void {

        this._route.params.subscribe(params => {

            let data = {
                specialityId: params['specialityId'],
                specialistRequestId: params['SessionId'],
                isRadiologySession: true,
                type: params['type']
            }
            this.dynamicNotesData = data;
            if (params['pageNum']) {
                this.pageNum = params['pageNum'] as number;
                this.pacsDeleted = true;

            }


            this.getRequestById(data.specialistRequestId);
            this.setPacsListener();


        });
    }

    setPacsListener() {
        this._signalRService.hubConnection.on('GetPACSCredentials', (username, password) => {

            this.viewer.Authenticate(username, password, '', '', this.request.mrn);
            setTimeout(() => {
                // if (this.pageNum == -1) {
                //     this.pageNum = 0;
                // }

                this.showLoader = false;

            }, 5000);
        });
    }

    getRequestById(id) {

        this._radiologyService.getRadiologyRequestById(id).subscribe(
            (response) => {

                if (response.status == 200) {
                    this.request = JSON.parse(response._body);
                    sessionStorage.setItem('modalitySubTypeId',this.request.modalitySubTypeId);

                    var timeDiff = Math.abs(Date.now() - Date.parse(this.request.dob));



                    if (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) <= 1) {
                        this.request.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " year";
                    } else {

                        this.request.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " years";
                    }

                    if (this.request.age == "0 year") {
                        if (Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) <= 1) {
                            this.request.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + " month";

                        } else {
                            this.request.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + " months";
                        }
                    }

                    if (this.request.age == "0 month") {
                        if (Math.floor((timeDiff / (1000 * 3600 * 24))) <= 1) {
                            this.request.age = Math.floor((timeDiff / (1000 * 3600 * 24))) + " day";
                        } else {
                            this.request.age = Math.floor((timeDiff / (1000 * 3600 * 24))) + " days";
                        }
                    }

                    if (!this.pacsDeleted) {
                        this.getPacs();
                        this.requestrefresh = Observable.interval(5000);
                        this.requestrefreshsubscribe = this.requestrefresh.subscribe(ex => {
                            this.getPacs();
                        });
                    }

                }

            },
            (error) => {


            }
        );


    }

    getPacs() {
        //this.request.mrn
        this._patientinfoservice.checkpatinentpacsinfo(this.request.mrn).subscribe(
            (response) => {
                if (response.status == 200) {
                    this.requestrefreshsubscribe.unsubscribe();
                    this.getPacsCredentials();
                }

            }, (error) => {
            });
    }

    getPacsCredentials() {

        if (this._signalRService.ishubConnection) {
            this._signalRService.hubConnection.invoke('GetPACSCredentials');


            this.stopinterval = true;
        } else {

            setTimeout(() => {
                this.getPacsCredentials();
            }, 2000);
        }

    }

    findPatientStudy(val) {
        this.viewer.findStudy(val);
    }

    onPacs() {
        this.pageNum = 0;
    }

    onNotes() {
        this.pageNum = 1;
    }

    onExit() {
        this._router.navigate(['/radiology']);
        setTimeout(() => {
            window.location.reload();
        }, 1000);


    }

    ngOnDestroy() {

        if (!this.pacsDeleted) {
            this.requestrefreshsubscribe.unsubscribe();
            this._patientinfoservice.patientinfoshare.unsubscribe();
        }
        this._signalRService.hubConnection.off('GetPACSCredentials');
    }


    refreshPacs() {
        // let msg = new Message();
        // msg.msg = "Notes signed successfully"
        // msg.type = 'success';
        // msg.iconType = 'check_circle';
        // this._uiService.showToast(msg);

        var commandBlock = "__cmd__;pacs;";
        vidyoConnector.SendChatMessage({
            message: commandBlock
        }).then(() => {



            let msg = new Message();
            msg.msg = "Pacs successfully requested"
            msg.type = 'success';
            msg.iconType = 'check_circle';
            this._uiService.showToast(msg);

        }).catch(() => {
            console.error("SendChatMsg Failed");
            let msg = new Message();
            msg.msg = "Failed to request pacs"
            msg.type = 'error';
            msg.iconType = 'check_circle';
            this._uiService.showToast(msg);
        });
    }
    ondisconnect() {
        let msg = new Message();
        // msg.msg = this.Mrn;
        msg.msg = "Are you sure you want to end this session ?";
        msg.title = "";
        msg.okBtnTitle = "End Session";
        msg.onOkBtnClick = this.yesClick.bind(this);
        msg.showInput = "none";
        this._uiService.showMsgBox(msg);
    }

    EndSession() {
        let specialistRequestId = this._patientinfoservice.getSpecialistRequestId();

        this._specialistRequestService.setSpecialistRequest(specialistRequestId, 'EndSession', '').subscribe(
            (response) => {

                if (response.status == 200) {
                    disconnectCall();
                    $("#vidyoscript").remove();

                }

            },
            (error) => {

                disconnectCall();

                let msg = new Message();
                msg.msg = "Something went wrong, please try again.";

            }
        );
    }
    yesClick() {

        this.EndSession();

        // disconnectCall();

    }
    stethos: boolean = false;
    stethoscopeButton() {
        this.stethos = !this.stethos;
        // let playaudio: boolean = false;

        document.getElementById("stethoscopeButton").classList.add('list-btn-round');
        if (this.stethos) {
            // playaudio = true;
            document.getElementById("stethoscopeButton").classList.add('pulse');
            document.getElementById("stethoscopeButton").classList.remove('dark');

            this._statusService.getUserInfo().subscribe(
                (response) => {
                    if (response) {

                        this._signalRService.hubConnection   // (string userGUID, string endPointId)
                            .invoke('RequestStethocope', response.userGUID, sessionStorage.getItem('endPointId'))
                            .catch(err => console.error(err));
                    } else {

                    }
                },
                (error) => {
                }
            );


        } else {
            // playaudio = false;
            document.getElementById("stethoscopeButton").classList.remove('pulse');
            document.getElementById("stethoscopeButton").classList.add('dark');

            this._signalRService.hubConnection // (string endPointId)
                .invoke('StopStream', sessionStorage.getItem('endPointId'))
                .catch(err => console.error(err));
        }

    }

}

