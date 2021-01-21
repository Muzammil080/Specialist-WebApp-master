import { Component, OnInit, Inject, OnDestroy, AfterViewChecked, AfterViewInit } from '@angular/core'
import { UIService } from "../core/services/ui/ui.service";
import { Message } from "../core/models/message";
import { AuthService } from '../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { PatientInfoService, PatientInfo } from "../core/services/specialist/patientinfo.service";
// import { Accepted } from "../core/services/specialist/specialistrequests.service";
import { Pacs } from '../core/main';
import { SpecialistRequestService } from "../core/services/specialist/specialistrequests.service";
import { MatDialogRef, MatDialog } from "@angular/material";
import { Observable } from 'rxjs/Rx';
import { RouteService } from '../core/services/guard/route.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SignalRService } from '../core/services/signalr/signalr.service';
import { StatusService } from '../core/services/user/status.service';
import { environment } from './../../environments/environment';

declare function disconnectCall(): any;
// declare function previewshow(): any;
// declare function previewhide(): any;
declare function joinViaBrowser(): any;
declare function stethoscopeButtonMicrophoneToggle(): any;
declare var $;
declare var mouseeventblock;
declare var vidyoConnector;
declare var buffer;

@Component({
    selector: 'videocall',
    moduleId: module.id,
    templateUrl: 'videocall.component.html',
    styleUrls: ['videocall.component.css']
})
export class VideoCallComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
    constructor(private _statusService: StatusService, private _signalRService: SignalRService, private location: Location, private _routeService: RouteService, private dialog: MatDialog, private _specialistRequestService: SpecialistRequestService, private viewer: Pacs, private _uiService: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _patientinfoservice: PatientInfoService) {

    }
    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {

        this.location.forward();

        setInterval(() => {
            this.location.forward();
        }, 100);

        return false;

    }
    dynamicNotesData;
    endpointFacilityName;
    endpointSerialNumber;

    specialityName;
    endPoint;

    pageNum = 1;

    previewD = 'block';

    Type: any;
    Name = 'loading....';
    Gender;
    Hospital;
    LastWellKnownDate;
    VisitType;
    Priority;
    Mrn;
    PhysicianCell;
    PhysicianName;
    Age;
    Dob;
    reasonForRequest;
    videoLoader = "none";
    patientInfo: PatientInfo;

    timeout;
    firsttimeload = true;
    Pacsshow = false;

    stopinterval = false;

    connectThread;
    connectThreadSubscribe;


    showPacs: boolean = true;
    showLoader: boolean = false;

    refresh() {

        this.showPacs = false;
        this.showLoader = true;

        setTimeout(() => {
            this.showPacs = true;
            this.showLoader = true;
            this.getPacsCredentials();
        }, 1000);
    }
    setpatintinfo() {


        this._patientinfoservice.receivepatientinfo().subscribe(data => {

            this.Dob = data.dob;
            var timeDiff = Math.abs(Date.now() - Date.parse(data.dob));
            this.Name = data.firstName + ' ' + data.lastName;


            if (Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) <= 1) {
                this.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " year";
            } else {

                this.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " years";
            }

            if (this.Age == "0 year") {
                if (Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) <= 1) {
                    this.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + " month";

                } else {
                    this.Age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + " months";
                }
            }

            if (this.Age == "0 month") {
                if (Math.floor((timeDiff / (1000 * 3600 * 24))) <= 1) {
                    this.Age = Math.floor((timeDiff / (1000 * 3600 * 24))) + " day";
                } else {
                    this.Age = Math.floor((timeDiff / (1000 * 3600 * 24))) + " days";
                }
            }

            this.Gender = data.gender;
            this.Mrn = data.mrn;
            this.PhysicianName = data.requestingPhysicianName;
            this.PhysicianCell = data.requestingPhysicianCell;
            this.LastWellKnownDate = data.lastWellKnownDate;
            this.VisitType = data.visitType ? data.visitType : '-';
            this.Priority = data.isUrgent ? 'Urgent' : 'Routine';

            this._patientinfoservice.checkpatinentpacsinfo(data.mrn).subscribe(
                (response) => {
                    if (response.status == 200) {


                        this.getPacsCredentials();


                    }

                }, (error) => {

                    this.checkforpacinfo();
                });
        });


    }

    patientId: number;

    getPacsCredentials() {

        if (this._signalRService.ishubConnection) {
            this._signalRService.hubConnection.invoke('GetPACSCredentials');

            this.Pacsshow = true;
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

    checkforpatientinfo() {

        let specialistRequestId = this._patientinfoservice.getSpecialistRequestId();

        this._patientinfoservice.getpatientInfo(specialistRequestId).subscribe(
            (patientinfo) => {

                this.patientInfo = JSON.parse(patientinfo._body);
                this._patientinfoservice.sendpatientinfo(this.patientInfo);

            }, (err) => {

                setTimeout(() => {
                    this.checkforpatientinfo();
                }, 1000);

            }
        );
    }
    checkforpacinfo() {
        setInterval(() => {
            if (!this.stopinterval) {

                this._patientinfoservice.checkpatinentpacsinfo(this.patientInfo.mrn).subscribe(

                    (response) => {
                        if (response.status == 200) {
                            this.getPacsCredentials();
                        }

                    },
                    (error) => {

                    });
            }
        }, 60000);


    }
    callanimate() {
        setTimeout(() => {
            document.getElementById("connecting-text-0").style.display = 'none';
            document.getElementById("connecting-1").style.visibility = 'visible';
            document.getElementById("connecting-text-1").style.display = 'block';

        }, 0);

        setTimeout(() => {
            document.getElementById("connecting-line-1").style.display = "block";
            document.getElementById("connecting-1").style.visibility = 'hidden';
            document.getElementById("connecting-2").style.visibility = 'visible';

            document.getElementById("connecting-text-1").style.display = 'none';
            document.getElementById("connecting-text-2").style.display = 'block';

        }, 3500);

        setTimeout(() => {
            document.getElementById("connecting-line-2").style.display = "block";
            document.getElementById("connecting-1").style.visibility = 'hidden';
            document.getElementById("connecting-2").style.visibility = 'hidden';
            document.getElementById("connecting-3").style.visibility = 'visible';

            document.getElementById("connecting-text-1").style.display = 'none';
            document.getElementById("connecting-text-2").style.display = 'none';
            document.getElementById("connecting-text-3").style.display = 'block';

        }, 7000);

        // setTimeout(()=> {
        //     document.getElementById("connecting1").style.visibility='hidden'; 
        //     document.getElementById("connecting2").style.visibility='hidden'; 
        //     document.getElementById("connecting3").style.visibility='hidden'; 
        // }, 10500);
    }

    checkEnpoint() {
        let specialistRequestId = this._patientinfoservice.getSpecialistRequestId();

        this._specialistRequestService.pingEnpoint(specialistRequestId).subscribe(
            (response) => {

                if (response.status == 200 && (response._body == "Completed" || response._body == "ForceCompleted")) {
                    $('.cartdisconect').fadeIn();


                    setTimeout(() => {
                        disconnectCall();
                        $('.cartdisconect').fadeOut();
                    }, 2000);
                }

            },
            (error) => {


            }
        );
    }

    Connect() {

        if (this._specialistRequestService.issessionrequest || JSON.parse(sessionStorage.getItem('vidyo'))) {

            joinViaBrowser();

            this._route.params.subscribe(params => {
                this.Type = params['type'];

                if (params['type'] == 'session') {

                    this.Hospital = sessionStorage.getItem('facilityName');
                    this.reasonForRequest = sessionStorage.getItem('reasonForRequest');
                    this.endPoint = sessionStorage.getItem('endPoint');
                    this.specialityName = sessionStorage.getItem('specialityName');
                    let specialistRequestId = this._patientinfoservice.getSpecialistRequestId();
                    if (specialistRequestId > 0) {
                        this.setpatintinfo();
                        this._patientinfoservice.getpatientInfo(specialistRequestId).subscribe(
                            (patientinfo) => {

                                this.patientInfo = JSON.parse(patientinfo._body);
                                this._patientinfoservice.sendpatientinfo(this.patientInfo);

                                let data = {
                                    specialityId: this.patientInfo.specialityId,
                                    specialistRequestId: specialistRequestId
                                }
                                this.dynamicNotesData = data;


                            }, (err) => {
                                this.checkforpatientinfo();
                            }
                        );

                    }
                    else {
                        this.setpatintinfo();
                    }
                } else if (params['type'] == 'endpoint') {
                    this.endpointFacilityName = sessionStorage.getItem('endpointFacilityName');
                    this.Hospital = this.endpointFacilityName;
                    this.endpointSerialNumber = sessionStorage.getItem('endpointSerialNumber');
                    this.endPoint = this.endpointSerialNumber;
                }
            });
        } else {
            this._router.navigate(['']);
        }
    }

    ngAfterViewInit() {





    }

    showoptionbeforeconnect() {
        setTimeout(() => {
            document.getElementById('sessionEndOption').style.display = 'block';
            document.getElementById("connecting-line-3").style.display = "block";
            document.getElementById("connecting-1").style.visibility = 'hidden';
            document.getElementById("connecting-2").style.visibility = 'hidden';
            document.getElementById("connecting-3").style.visibility = 'hidden';
            document.getElementById("connecting-text-1").style.display = 'none';
            document.getElementById("connecting-text-2").style.display = 'none';
            document.getElementById("connecting-text-3").style.display = 'none';
            document.getElementById("material-icons-4").style.color = 'red';

        }, 60000);
    }
    ngOnInit(): void {

        this.showoptionbeforeconnect();
        this.Connect();
        this.callanimate();
        setInterval(() => {
            this.checkEnpoint();
        }, 60000);

        this._signalRService.hubConnection.on('GetPACSCredentials', (username, password) => {
            this.viewer.Authenticate(username, password, '', '', this.Mrn);
            setTimeout(() => {

                this.showLoader = false;

            }, 5000);
        });

        this._signalRService.hubConnection.on("StreamStethoscope", (message) => {

            if (this.stethos) {
                buffer.addChunk(message);
            }

        });
    }

    onSpecialist() {


        let msg = new Message();
        msg.msg = "Select a specilist";
        msg.title = "";
        msg.okBtnTitle = null;
        msg.onOkBtnClick = null;
        msg.cancelBtnTitle = "OK";

        // msg.onCancelBtnClick=;

        msg.showInput = "addSpec";
        this._uiService.showMsgBox(msg);
    }


    onPacs() {
        if (this.pageNum != 2) {

            // this.viewer.findPatients();
            $('#renderer1').css("width", "280px");
            $('#renderer1').css("height", "180px");
            $('#renderer1').css("top", "calc(100vh - 180px)");
            $('#renderer1').css("left", "0px");
            document.getElementById("renderer0").style.visibility = "hidden";
            // $("#renderer0").hide();
            $("#pacsbox").show();

            if (this.firsttimeload) {
                // this.viewer.findPatients();
                this.firsttimeload = false;
            }
            // $("#remoteRenderer_Kart").animate({height: "150px"; width: "200px"; top: newHeightpacs },1000);

            this.previewD = "none";
            this.pageNum = 2;
        }
        mouseeventblock = true;
    }
    onVideo() {

        if (this.pageNum != 1) {



            $('#renderer1').css("width", "100%");
            $('#renderer1').css("height", "100vh");
            $('#renderer1').css("top", "0px");
            $('#renderer1').css("left", "0px");
            document.getElementById("renderer0").style.visibility = "visible";

            this.previewD = "block";
            this.pageNum = 1;

        }
        mouseeventblock = false;

    }
    onNotes() {
        if (this.pageNum != 3) {

            $('#renderer1').css("width", "280px");
            $('#renderer1').css("height", "180px");
            $('#renderer1').css("left", "");
            $('#renderer1').css("top", "calc(100vh - 180px)");
            $('#renderer1').css("right", "0px");

            // $('#renderer1').css("left", "calc(100% - 280px)");
            // $("#renderer0").hide()
            $("#pacsbox").hide();
            document.getElementById("renderer0").style.visibility = "hidden";
            this.previewD = "none";
            this.pageNum = 3;
        }
        mouseeventblock = true;
    }
    ngAfterViewChecked() {

        //   this.setpatintinfo();

    }
    ngOnDestroy() {

        this._patientinfoservice.patientinfoshare.unsubscribe();
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
        stethoscopeButtonMicrophoneToggle();
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

