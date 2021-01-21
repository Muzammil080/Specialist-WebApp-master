import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    NgZone,
    QueryList,
    ViewChildren,
    AfterViewInit,
} from "@angular/core";
import { UIService } from "../core/services/ui/ui.service";
import { Message } from "../core/models/message";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import {
    PatientInfoService,
    PatientInfo,
} from "../core/services/specialist/patientinfo.service";
import { Pacs } from "../core/main";
import {
    SpecialistRequestService,
    Accepted,
} from "../core/services/specialist/specialistrequests.service";
import { Observable, Subject } from "rxjs/Rx";
import { Location } from "@angular/common";
import { SignalRService } from "../core/services/signalr/signalr.service";
import { StatusService } from "../core/services/user/status.service";
import { OpentokService } from "../core/services/Opentok/Opentok.service";
import * as OT from "@opentok/client";
import { OpdService } from "../core/services/opd/opd.service";
import { MatDialog } from "@angular/material";
import { NurseMessageComponent } from "./nurse-message/nurse-message.component";
import { SurveyService } from "../core/services/survey/survey.service";
import { SurveyComponent } from "./survey/survey.component";
import { environment } from "../../environments/environment";
import { PatientInfoComponent } from "./patient-info/patient-info.component";
import { EndpointsService } from "../core/services/endpoints/endpoints.service";
import { takeUntil } from "rxjs/operators";
import { InterpreterComponent } from "./invite/interpreter/interpreter.component";
import { SpecialistComponent } from "./invite/specialist/specialist.component";
import { ExternalSpecialistComponent } from "./invite/external-specialist/external-specialist.component";
import { OtherComponent } from "./invite/other/other.component";
import { InviteService } from "../core/services/invites/invite.service";
import { VideoEffectsService } from "../core/services/videoeffects/video-effects.service";
import { StrokeImagesComponent } from "./stroke-images/stroke-images.component";
// import { AppointmentService } from '../core/services/appointment/appointment.services';
declare var $;
declare var buffer;

@Component({
    selector: "app-tokbox",
    templateUrl: "./tokbox.component.html",
    styleUrls: ["./tokbox.component.css"],
})
export class TokboxComponent implements OnInit, OnDestroy, AfterViewInit {
    dynamicNotesData;
    endpointFacilityName;
    endpointSerialNumber;
    endpointFacilityId;
    specialistRequestId;

    specialityName: string = "";
    endPoint;

    pageNum = 1;

    previewD = "block";

    Type: any;
    Name = "loading....";
    Gender: any;
    Hospital: string;
    LastWellKnownDate: any;
    Mrn: any;
    PhysicianCell: any;
    PhysicianName: any;
    Age: string | number;
    reasonForRequest: string;
    videoLoader = "none";
    patientInfo: PatientInfo;
    patientId: number;

    timeout: any;
    firsttimeload = true;
    Pacsshow = false;

    stopinterval = false;

    connectThread: any;
    connectThreadSubscribe: any;
    stethos = false;

    session: OT.Session;
    streams: Array<OT.Stream> = [];
    changeDetectorRef: ChangeDetectorRef;
    public rect = {startX : 0, startY : 0, w:0, h:0};
    public canvas;
    public context;
    pressinterval;
    mousepress = true;
    clickCount = 0;
    doubleclicked = false;
    dragclick = false;
    lasttime = 0;
    mouseeventblock = false;
    microphonePrivacy = false;
    cameraPrivacy = false;
    singleClickTimer: any;
    direction: string;
    callConnectingTimer;

    radioPadding = 24;
    showPacs = true;
    showLoader = false;
    pacsVisble = false;
    closeDragElementoffsetTop = 0;
    isAppointment = false;
    appointmentId;
    workflowInstanceId;
    HeartRate: any;
    TopBloodPressure: any;
    BottomBloodPressure: any;
    Temperature: any;
    draggable = false;
    position: any;
    disconnectFromKart = false;
    isOnline = false;
    showoptions = false;
    sessionId: any;
    isDirectCall: string = "false";
    isEndpointError: boolean = false;
    endpointErrorMessage: string = "";
    endpointName: string = "";
    endpointLocation: string = "";
    animate1;
    animate2;
    animate3;
    showOptionBeforeConnectTimeout;
    veemedSupportNumber = "+1(800) 558-0022";
    notifier = new Subject(); //to be used with take untill to unsubscribe in ng on destroy
    checkEndpointInterval;
    checkPacsInfoInterval;
    surveyShown: boolean = false;
    primaryStreamId: string;
    areMutlipleStreams: boolean = false;
    kartLoaded: boolean = false;
    isPrimaryStreamKart: boolean = false;
    checkInvitesInterval;
    invites = [];
    deniedInvites = [];

    isHorusScopeOn: boolean = false;
    userPartnerSiteId: number = 0;
    isBlurred: boolean = false;
    strokeImagesShown: boolean = false;
    hideInvite: boolean = false; // now is used to remove the more menu for old karts
    @ViewChildren("subs") subs: QueryList<any>;
    constructor(
        private _statusService: StatusService,
        private _signalRService: SignalRService,
        private location: Location,
        private _specialistRequestService: SpecialistRequestService,
        // private _appointmentService: AppointmentService,
        private viewer: Pacs,
        private _uiService: UIService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _patientinfoservice: PatientInfoService,
        private opentokService: OpentokService,
        ref: ChangeDetectorRef,
        private _opdService: OpdService,
        private _dialogRef: MatDialog,
        private _surveyService: SurveyService,
        private ngZone: NgZone,
        private _endpointsService: EndpointsService,
        private inviteService: InviteService
    ) // private videoEffectsServie:VideoEffectsService
    {
        this.changeDetectorRef = ref;
    }

    ngOnInit() {
        if (sessionStorage.getItem("isDirectCall")) {
            this.isDirectCall = sessionStorage.getItem("isDirectCall");
        }
        if (sessionStorage.getItem("partnerSiteId")) {
            this.userPartnerSiteId = +sessionStorage.getItem("partnerSiteId");
        }
        if (sessionStorage.getItem("specialityName")) {
            this.specialityName = sessionStorage.getItem("specialityName");
        }
        if (sessionStorage.getItem("isHorusScopeOn")) {
            this.isHorusScopeOn =
                sessionStorage.getItem("isHorusScopeOn") === "true";
        }
        this.showoptionbeforeconnect();
        this.Connect();
        this.callanimate();
        this.checkEndpointInterval = setInterval(() => {
            this.checkEnpoint();
        }, 60000);

        this._signalRService.hubConnection.on(
            "GetPACSCredentials",
            (username, password) => {
                this.viewer.Authenticate(username, password, "", "", this.Mrn);
            }
        );

        this._signalRService.hubConnection.on(
            "StethoscopeDisconnected",
            (message) => {
                this.stopStethoscope();
            }
        );

        this._signalRService.hubConnection.on(
            "StreamStethoscope",
            (message) => {
                if (this.stethos) {
                    buffer.addChunk(message);
                }
            }
        );

        this._endpointsService
            .getEndpointError()
            .pipe(takeUntil(this.notifier))
            .subscribe((d) => {
                console.log(d, "endpoint error message from tokbox");
                this.endpointName = sessionStorage.getItem("endpointName");
                this.endpointErrorMessage =
                    "An error occurred while connecting to endpoint " +
                    this.endpointName +
                    " at " +
                    this.endpointFacilityName +
                    "(Error: " +
                    d +
                    " ). Please retry or contact customer support at " +
                    this.veemedSupportNumber +
                    "." +
                    " Thank you.";
                this.endAnimate();
                //this.EndSession();
                this.showEndpointError();
            });
    }
    stopStethoscope() {
        this.stethos = false;
        document.getElementById("stethoscopeButton").classList.remove("pulse");
        document.getElementById("stethoscopeButton").classList.add("dark");

        this._signalRService.hubConnection
            .invoke("StopStream", sessionStorage.getItem("endPointId"))
            .catch((err) => console.error(err));
    }

    canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
        // this.location.forward();

        // setInterval(() => {
        //     this.location.forward();
        // }, 100);

        // return false;
        return true;
    }

    setpatintinfo() {
        if (this.isAppointment) {
            const timeDiff = Math.abs(
                Date.now() - Date.parse(this.patientInfo.dob)
            );
            this.Name =
                this.patientInfo.firstName + " " + this.patientInfo.lastName;

            this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
            if (this.Age === 0) {
                this.Age =
                    Math.floor(timeDiff / (1000 * 3600 * 24) / 30) + " month";
            } else if (this.Age === 0) {
                this.Age = Math.floor(timeDiff / (1000 * 3600 * 24)) + " days";
            }

            this.Gender = this.patientInfo.gender;
            this.Mrn = this.patientInfo.mrn;

            this.HeartRate = this.patientInfo.heartRate;
            this.TopBloodPressure = this.patientInfo.topBloodPressure;
            this.BottomBloodPressure = this.patientInfo.bottomBloodPressure;
            this.Temperature = this.patientInfo.temperature;

            console.error("setpatintinfo");
            this._patientinfoservice
                .checkpatinentpacsinfo(this.patientInfo.mrn)
                .subscribe(
                    (response) => {
                        if (response.status === 200) {
                            this.getPacsCredentials();
                        }
                    },
                    (error) => {
                        this.checkforpacinfo();
                    }
                );
        } else {
            this._patientinfoservice
                .receivepatientinfo()
                .takeUntil(this.notifier)
                .subscribe((data) => {
                    console.log("data in receivepatientinfo", data);
                    const timeDiff = Math.abs(
                        Date.now() - Date.parse(data.dob)
                    );
                    this.Name = data.firstName + " " + data.lastName;

                    this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
                    if (this.Age === 0) {
                        this.Age =
                            Math.floor(timeDiff / (1000 * 3600 * 24) / 30) +
                            " month";
                    } else if (this.Age === 0) {
                        this.Age =
                            Math.floor(timeDiff / (1000 * 3600 * 24)) + " days";
                    }

                    this.Gender = data.gender;
                    this.Mrn = data.mrn;
                    if (!this.isAppointment) {
                        this.PhysicianName = data.requestingPhysicianName;
                        this.PhysicianCell = data.requestingPhysicianCell;
                        this.LastWellKnownDate = data.lastWellKnownDate;
                    }

                    if (this.isAppointment) {
                        this.HeartRate = data.heartRate;
                        this.TopBloodPressure = data.topBloodPressure;
                        this.BottomBloodPressure = data.bottomBloodPressure;
                        this.Temperature = data.temperature;
                    }

                    console.error("setpatintinfo");
                    this._patientinfoservice
                        .checkpatinentpacsinfo(data.mrn)
                        .subscribe(
                            (response) => {
                                if (response.status === 200) {
                                    this.getPacsCredentials();
                                }
                            },
                            (error) => {
                                this.checkforpacinfo();
                            }
                        );
                });
        }
    }

    getPacsCredentials() {
        console.log("getPacsCredentials");
        console.log(
            "this._signalRService.ishubConnection",
            this._signalRService.ishubConnection
        );
        if (this._signalRService.ishubConnection) {
            this._signalRService.hubConnection.invoke("GetPACSCredentials");

            this.showPacs = true;
            this.Pacsshow = true;
            this.stopinterval = true;
            if (this.pageNum === 2) {
                $(".pacsbox").show();
            }
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
        const specialistRequestId = this._patientinfoservice.getSpecialistRequestId();

        this._patientinfoservice.getpatientInfo(specialistRequestId).subscribe(
            (patientinfo) => {
                this.patientInfo = JSON.parse(patientinfo._body);
                this._patientinfoservice.sendpatientinfo(this.patientInfo);
            },
            (err) => {
                setTimeout(() => {
                    this.checkforpatientinfo();
                }, 1000);
            }
        );
    }

    checkforpacinfo() {
        console.error("checkforpacinfo");
        this.checkPacsInfoInterval = setInterval(() => {
            if (!this.stopinterval) {
                this._patientinfoservice
                    .checkpatinentpacsinfo(this.patientInfo.mrn)
                    .subscribe(
                        (response) => {
                            if (response.status === 200) {
                                this.getPacsCredentials();
                            }
                        },
                        (error) => {}
                    );
            }
        }, 60000);
    }

    /**
     * Callanimates
     * Display the animation before call connection
     */
    callanimate() {
        this.animate1 = setTimeout(() => {
            document.getElementById("connecting-text-0").style.display = "none";
            document.getElementById("connecting-1").style.visibility =
                "visible";
            document.getElementById("connecting-text-1").style.display =
                "block";
        }, 0);

        this.animate2 = setTimeout(() => {
            document.getElementById("connecting-line-1").style.display =
                "block";
            document.getElementById("connecting-1").style.visibility = "hidden";
            document.getElementById("connecting-2").style.visibility =
                "visible";

            document.getElementById("connecting-text-1").style.display = "none";
            document.getElementById("connecting-text-2").style.display =
                "block";
        }, 3500);

        this.animate3 = setTimeout(() => {
            document.getElementById("connecting-line-2").style.display =
                "block";
            document.getElementById("connecting-1").style.visibility = "hidden";
            document.getElementById("connecting-2").style.visibility = "hidden";
            document.getElementById("connecting-3").style.visibility =
                "visible";

            document.getElementById("connecting-text-1").style.display = "none";
            document.getElementById("connecting-text-2").style.display = "none";
            document.getElementById("connecting-text-3").style.display =
                "block";
        }, 7000);
    }

    checkEnpoint(fromOnlinestatus?:boolean ) {
        const specialistRequestId = this._patientinfoservice.getSpecialistRequestId();
        console.log(specialistRequestId);
        console.log(this.isAppointment);
        if (specialistRequestId) {
            this._specialistRequestService
                .pingEnpoint(specialistRequestId)
                .subscribe(
                    (response) => {
                        if (
                            response.status === 200 &&
                            (response._body === "Completed" ||
                                response._body === "ForceCompleted")
                        ) {
                            console.log(response);
                            $(".cartdisconect").fadeIn();

                            setTimeout(() => {
                                console.warn(
                                    "disconnect called in checkEndpoint"
                                );
                                this.disconnectCall();
                                $(".cartdisconect").fadeOut();
                            }, 2000);
                        } else if(response._body.toLowerCase() === "connected" && fromOnlinestatus){
                            $(".online").fadeIn();
                        }
                    },
                    (error) => {}
                );
        } else if (this.isAppointment) {
            const appointmentId = sessionStorage.getItem("appointmentId");
            this._opdService.GetSessionInfo(appointmentId).subscribe(
                (response) => {
                    // const data = response
                    console.log(response);
                    response = response.json();
                    this.sessionId = response.sessionId;
                    console.log(this.sessionId);
                    this._specialistRequestService
                        .pingEnpointApp(this.sessionId)
                        .subscribe(
                            (resp) => {
                                if (
                                    resp.status === 200 &&
                                    (resp._body === "Completed" ||
                                        resp._body === "ForceCompleted")
                                ) {
                                    console.log(resp);
                                    $(".cartdisconect").fadeIn();

                                    setTimeout(() => {
                                        console.warn(
                                            "disconnect called in checkEndpoint"
                                        );
                                        this.disconnectCall();
                                        $(".cartdisconect").fadeOut();
                                    }, 2000);
                                }else if(response._body.toLowerCase() === "connected" && fromOnlinestatus){
                                    $(".online").fadeIn();
                                }
                            },
                            (error) => {}
                        );
                },
                (error) => {
                    if (error.status === 0) {
                    } else {
                        this.EndSession();
                        const message = new Message();
                        message.type = "danger";
                        message.iconType = "error";
                        message.msg = error._body;
                        this._uiService.showToast(message);
                    }
                }
            );
        }
    }

    Connect() {
        console.log(sessionStorage.getItem("appointmentId"), "appId");
        if (
            this._specialistRequestService.issessionrequest ||
            JSON.parse(sessionStorage.getItem("vidyo"))
        ) {
            const EndpointSessionInfo: Accepted = JSON.parse(
                sessionStorage.getItem("vidyo")
            );
            this.specialistRequestId = EndpointSessionInfo.specialistRequestId;
            this.endpointFacilityId = EndpointSessionInfo.facilityId;
            let idToCheckInvites: any = 0;
            let isAppt = false;
            if (sessionStorage.getItem("appointmentId")) {
                idToCheckInvites = sessionStorage.getItem("appointmentId");
                isAppt = true;
            } else {
                idToCheckInvites = this.specialistRequestId;
            }
            this.checkInvitesInterval = setInterval(() => {
                this.inviteService
                    .getAllInvites(idToCheckInvites, isAppt)
                    .subscribe(
                        (res) => {
                            this.invites = JSON.parse(res._body).filter(
                                (x) => x.inviteStatus.toLowerCase() == "waiting"
                            );

                            this.showDeniedInviteMessage(
                                JSON.parse(res._body).filter(
                                    (x) =>
                                        x.inviteStatus.toLowerCase() == "denied"
                                )
                            );
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
            }, 15000);
            this.joinTokBox(EndpointSessionInfo);

            this._route.params.subscribe((params) => {
                this.Type = params["type"];
                console.log(this.Type);

                if (params["type"] === "session") {
                    this.Hospital = sessionStorage.getItem("facilityName");
                    this.reasonForRequest = sessionStorage.getItem(
                        "reasonForRequest"
                    );
                    this.endPoint = sessionStorage.getItem("endPoint");
                    this.specialityName = sessionStorage.getItem(
                        "specialityName"
                    );
                    console.log(
                        sessionStorage.getItem("appointmentId"),
                        "appId"
                    );
                    if (sessionStorage.getItem("appointmentId")) {
                        console.log(sessionStorage.getItem("appointmentId"));
                        this.appointmentId = sessionStorage.getItem(
                            "appointmentId"
                        );
                        console.log(this.appointmentId);
                        this.workflowInstanceId = sessionStorage.getItem(
                            "workflowInstanceId"
                        );
                        this.isAppointment = true;
                    }

                    console.log(this.isAppointment);
                    if (this.isAppointment) {
                        console.log(this.isAppointment);
                        this._opdService
                            .GetPatientInfo(this.appointmentId)
                            .subscribe((res) => {
                                const tempInfo = res.json();
                                console.log("tempInfo", tempInfo);
                                this.patientInfo = new PatientInfo();
                                this.patientInfo.dob = new Date(
                                    tempInfo.dob + "Z"
                                );

                                this.patientInfo.facilityName = sessionStorage.getItem(
                                    "facilityName"
                                );
                                this.patientInfo.firstName =
                                    tempInfo.patientFirstName;
                                this.patientInfo.gender = tempInfo.sex;
                                this.patientInfo.lastName =
                                    tempInfo.patientLastName;
                                this.patientInfo.mrn = tempInfo.mrn;
                                if (tempInfo.patientTriage) {
                                    this.patientInfo.bottomBloodPressure =
                                        tempInfo.patientTriage.bottomBloodPressure;
                                    this.patientInfo.heartRate =
                                        tempInfo.patientTriage.heartRate;
                                    this.patientInfo.temperature =
                                        tempInfo.patientTriage.temperature;
                                    this.patientInfo.topBloodPressure =
                                        tempInfo.patientTriage.topBloodPressure;
                                    this.patientInfo.currentMedications =
                                        tempInfo.patientTriage.currentMedications;
                                    this.patientInfo.history =
                                        tempInfo.patientTriage.history;
                                    this.patientInfo.allergies =
                                        tempInfo.patientTriage.allergies;
                                    this.patientInfo.comments =
                                        tempInfo.patientTriage.comments;
                                    this.patientInfo.habits =
                                        tempInfo.patientTriage.habits;
                                }
                                this.patientInfo.specialityId =
                                    tempInfo.specialityId;

                                this._patientinfoservice.sendpatientinfo(
                                    this.patientInfo
                                );

                                this.Name =
                                    this.patientInfo.lastName +
                                    " " +
                                    this.patientInfo.firstName;

                                this.Hospital =
                                    EndpointSessionInfo.facilityName;

                                this._patientinfoservice.sendpatientinfo(
                                    this.patientInfo
                                );
                                this.isOnline = tempInfo.visitType === "online";
                                this.setpatintinfo();
                                const data = {
                                    specialityId: this.patientInfo.specialityId,
                                    specialistRequestId: 0,
                                    appointmentId: this.appointmentId,
                                    workflowInstanceId: this.workflowInstanceId,
                                };
                                this._surveyService.surveyData.next({
                                    surveyType: "outpatient",
                                    forApplication: "veedoc-web",
                                    id: this.appointmentId,
                                });
                                this.dynamicNotesData = data;
                            });
                    } else {
                        const specialistRequestId = this._patientinfoservice.getSpecialistRequestId();
                        if (specialistRequestId > 0) {
                            this.setpatintinfo();
                            this._patientinfoservice
                                .getpatientInfo(specialistRequestId)
                                .subscribe(
                                    (patientinfo) => {
                                        this.patientInfo = JSON.parse(
                                            patientinfo._body
                                        );
                                        this._patientinfoservice.sendpatientinfo(
                                            this.patientInfo
                                        );

                                        const data = {
                                            specialityId: this.patientInfo
                                                .specialityId,
                                            specialistRequestId: specialistRequestId,
                                        };
                                        this.dynamicNotesData = data;
                                        this._surveyService.surveyData.next({
                                            surveyType: "inpatient",
                                            forApplication: "veedoc-web",
                                            id: specialistRequestId,
                                        });
                                    },
                                    (err) => {
                                        this.checkforpatientinfo();
                                    }
                                );
                        } else {
                            this.setpatintinfo();
                        }
                    }
                } else if (params["type"] === "endpoint") {
                    this.endpointFacilityName = sessionStorage.getItem(
                        "endpointFacilityName"
                    );

                    this.endpointName = sessionStorage.getItem("endpointName");
                    this.endpointLocation = sessionStorage.getItem(
                        "endpointLocation"
                    );
                    this.Hospital = this.endpointFacilityName;
                    this.endpointSerialNumber = sessionStorage.getItem(
                        "endpointSerialNumber"
                    );
                    this.endPoint = this.endpointSerialNumber;
                    this._surveyService.surveyData.next({
                        surveyType: "inpatient",
                        forApplication: "veedoc-web",
                        id: EndpointSessionInfo.specialistRequestId,
                    });
                }
            });
        } else {
            console.log("Session not found");
            // this._router.navigate(['/home']);
            window.location.href = "";
        }
    }

    /**
     * Joins tokbox client with the session using the opentokSevice
     * @param EndpointSessionInfo
     */
    joinTokBox(EndpointSessionInfo: Accepted) {
        console.log(
            "joinTokBox called with EndpointSessionInfo: ",
            EndpointSessionInfo
        );
        this.opentokService
            .initSession(EndpointSessionInfo)
            .then((session: OT.Session) => {
                this.ConfigSession(session);
            })
            .then(() => {
                this.opentokService.connect();
                this.ConfigDocument();
            })
            .catch((err) => {
                console.error("error occured:", err);
                this.showReconnectOption();
                // this._router.navigate(['/home']);
                // window.location.href = '';
            });
    }

    showReconnectOption() {
        document.getElementById("sessionEndOption").style.display = "block";
        document.getElementById("connecting-line-3").style.display = "block";
        document.getElementById("connecting-1").style.visibility = "hidden";
        document.getElementById("connecting-2").style.visibility = "hidden";
        document.getElementById("connecting-3").style.visibility = "hidden";
        document.getElementById("connecting-text-1").style.display = "none";
        document.getElementById("connecting-text-2").style.display = "none";
        document.getElementById("connecting-text-3").style.display = "none";
        document.getElementById("material-icons-4").style.color = "red";
        this.opentokService.PublisherCommands.next({
            type: "cameraPrivacy",
            value: true,
        });
        this.opentokService.PublisherCommands.next({
            type: "microphonePrivacy",
            value: true,
        });
    }
    showEndpointError() {
        document.getElementById("call-connecting").style.display = "flex";
        console.log("show endpoint error");
        document.getElementById("sessionEndOption").style.display = "none";
        document.getElementById("endpointError").style.display = "block";
        document.getElementById("connecting-line-3").style.display = "block";
        document.getElementById("connecting-1").style.visibility = "hidden";
        document.getElementById("connecting-2").style.visibility = "hidden";
        document.getElementById("connecting-3").style.visibility = "hidden";
        document.getElementById("connecting-text-0").style.display = "none";
        document.getElementById("connecting-text-1").style.display = "none";
        document.getElementById("connecting-text-2").style.display = "none";
        document.getElementById("connecting-text-3").style.display = "none";
        document.getElementById("material-icons-4").style.color = "red";

        this.opentokService.PublisherCommands.next({
            type: "cameraPrivacy",
            value: true,
        });
        this.opentokService.PublisherCommands.next({
            type: "microphonePrivacy",
            value: true,
        });
    }

    /**
     * Configure the session and the session events
     * @param session type: OT.Session
     */
    private ConfigSession(session: OT.Session) {
        console.log("ConfigSession called");
        this.session = session;
        this.session.on("streamCreated", (event) => {
            console.log("Stream Careated: ", event.stream);
            this.streams.push(event.stream);

            this.changeDetectorRef.detectChanges();

            if (this.streams.length > 1) {
                // let kart = document.getElementsByClassName('kart')[0];
                // if(kart){
                //         kart.classList.remove('primarysin');
                //         kart.classList.add('primary');

                // }
                this.areMutlipleStreams = true;
            }
        });
        this.session.on("streamDestroyed", (event) => {
            const idx = this.streams.indexOf(event.stream);
            if (idx > -1) {
                console.log("inside stream destroyed if");
                this.streams.splice(idx, 1);
                this.changeDetectorRef.detectChanges();
                if (this.streams.length == 1) {
                    this.areMutlipleStreams = false;
                    let kart = document.getElementsByClassName("kart")[0];
                    if (kart) {
                        if (kart.classList.contains("primary")) {
                            kart.classList.remove("primary");
                            kart.classList.add("primarysin");
                        } else {
                            this.primaryStreamId = kart.parentElement.id;
                            this.isPrimaryStreamKart = true;
                            console.log(
                                this.primaryStreamId,
                                "primary stream id kart"
                            );
                            kart.parentNode.removeChild(kart);

                            // let subscriber = kart.parentNode;
                            // subscriber.parentNode.removeChild(subscriber);
                            let draggDiv = document.getElementsByClassName(
                                "draggdiv"
                            )[0];
                            kart.classList.remove("subscriber");
                            kart.classList.add("primarysin");
                            //draggDiv.appendChild(subscriber);
                            draggDiv.appendChild(kart);
                        }
                        this.resizeCanvasToDisplaySize(this.canvas);
                    } else {
                    }
                } else if (this.streams.length > 1) {
                    let kart = document.getElementsByClassName("kart")[0];
                    if (kart) {
                        if (kart.classList.contains("primary")) {
                        } else {
                            this.primaryStreamId = kart.parentElement.id;
                            this.isPrimaryStreamKart = true;
                            console.log(
                                this.primaryStreamId,
                                "primary stream id kart"
                            );
                            kart.parentNode.removeChild(kart);

                            // let subscriber = kart.parentNode;
                            // subscriber.parentNode.removeChild(subscriber);
                            let draggDiv = document.getElementsByClassName(
                                "draggdiv"
                            )[0];
                            kart.classList.remove("subscriber");
                            kart.classList.add("primary");
                            //draggDiv.appendChild(subscriber);
                            draggDiv.appendChild(kart);
                        }
                    } else {
                    }
                }
            }
        });
        this.session.on("streamPropertyChanged", (event) => {
            this.opentokService.MuteCommands.next(event);
            console.log(event, "stream property changed");
        });
        const self = this;

        // Subcribe on session signanl call_disconnectfromKart
        this.session.on(
            "signal",
            function (event) {
                // disregard the error flag
                if (event.type.toLowerCase() === "signal:kart") {
                    if (event.data === "__cmd__;call_disconnectfromKart;") {
                        console.log("here");
                        $(".kartdisconect").fadeIn();
                        self.session.disconnect();
                        self.disconnectFromKart = true;
                        setTimeout(() => {
                            $("#publishVideo").hide();
                            $(".kartdisconect").fadeOut();
                            sessionStorage.removeItem("vidyo");
                            sessionStorage.removeItem("reasonForRequest");
                            sessionStorage.removeItem("facilityName");
                            self.showSurvey();
                        }, 1000);
                    }
                } else if (
                    event.data.toLowerCase() === "__cmd__;horus_scope_off;"
                ) {
                    self.isHorusScopeOn = false;
                    sessionStorage.setItem(
                        "isHorusScopeOn",
                        self.isHorusScopeOn.toString()
                    );
                }
            },
            self
        );

        // Subscribe on kart connects/disconnects
        this.opentokService.SubscriberCommands.pipe(
            takeUntil(this.notifier)
        ).subscribe((status: string) => {
            switch (status) {
                case "connected":
                    console.log("kart connected");
                    this.endAnimate();
                    // this.opentokService.PublisherCommands.next({
                    //     type: 'cameraPrivacy',
                    //     value: false
                    // });
                    // this.opentokService.PublisherCommands.next({
                    //     type: 'microphonePrivacy',
                    //     value: false
                    // });
                    $(".cartoffline").fadeOut();
                    $(".online").fadeOut();
                    break;
                case "destroyed":
                    console.log("kart disconnects");
                    if(navigator.onLine){
                        $(".cartoffline").fadeIn();
                    }
                    break;
                case "hideinvite":
                    this.hideInvite = true;
                    break;

                default:
                    break;
            }

            // setTimeout(() => {
            //   $('.cartoffline').fadeOut();
            // }, 2000);
        });
    }

    /**
     * Configure the page events and canvas
     */
    private ConfigDocument() {
        this.callConnectingTimer = setTimeout(() => {
            // if successfully connects to kart i.e has subscribers then connect else show reconnection options
            if (this.streams.length > 0) {
                console.log("inside call connecting if");
                // this.opentokService.PublisherCommands.next({
                //     type: 'cameraPrivacy',
                //     value: false
                // });
                // this.opentokService.PublisherCommands.next({
                //     type: 'microphonePrivacy',
                //     value: false
                // });
                this.endAnimate();
            } else {
                console.log("inside call connecting else");
                this.showReconnectOption();
            }
        }, 30000);
        this.canvassetup(
            <HTMLCanvasElement>document.getElementById("canvascontanier")
        );
        $("#connectionStatus").html("Ready to Connect");
        $("#helper").addClass("hidden");
        $("#toolbarLeft").removeClass("hidden");
        $("#toolbarCenter").removeClass("hidden");
        $("#toolbarRight").removeClass("hidden");

        window.addEventListener("online", this.updateOnlineStatus.bind(this));
        window.addEventListener("offline", this.updateOnlineStatus.bind(this));
    }
    endAnimate() {
        document.getElementById("call-connecting").style.display = "none";
        clearTimeout(this.callConnectingTimer);
        clearTimeout(this.animate1);
        clearTimeout(this.animate2);
        clearTimeout(this.animate3);
        clearTimeout(this.showOptionBeforeConnectTimeout);
    }

    /**
     * Updates online status
     * @param event
     */
    updateOnlineStatus(event) {
        const condition = navigator.onLine ? "online" : "offline";
        switch (condition) {
            case "online":
                $(".offline").fadeOut();
                this.checkEnpoint(true);
                //$(".online").fadeIn();
                //will be enabling online alert in checkendpoint
                break;

            case "offline":
                $(".online").fadeOut();
                $(".offline").fadeIn();
                break;

            default:
                break;
        }
    }

    showoptionbeforeconnect() {
        this.showOptionBeforeConnectTimeout = setTimeout(() => {
            document.getElementById("sessionEndOption").style.display = "block";
            document.getElementById("connecting-line-3").style.display =
                "block";
            document.getElementById("connecting-1").style.visibility = "hidden";
            document.getElementById("connecting-2").style.visibility = "hidden";
            document.getElementById("connecting-3").style.visibility = "hidden";
            document.getElementById("connecting-text-1").style.display = "none";
            document.getElementById("connecting-text-2").style.display = "none";
            document.getElementById("connecting-text-3").style.display = "none";
            document.getElementById("material-icons-4").style.color = "red";
        }, 60000);
    }

    //#region Navigation Actions

    onSpecialist() {
        const msg = new Message();
        msg.msg = "Select a specilist";
        msg.title = "";
        msg.okBtnTitle = null;
        msg.onOkBtnClick = null;
        msg.cancelBtnTitle = "OK";
        msg.showInput = "addSpec";
        this._uiService.showMsgBox(msg);
    }

    /**
     * Determines whether pacs on
     */
    onPacs() {
        this.draggable = true;
        this.position = { x: 0, y: 0 };
        if (this.pageNum !== 2) {
            $(".subscribers").hide();
            if (!this.isPrimaryStreamKart) {
                // $('.kart').removeClass('primary');
                this.makeKartPrimary();
            }

            $(".kart").addClass("subscriber");
            $(".subscriber").addClass("changed");
            // $('.subscriber').css('left', '0px');

            $(".draggdiv").addClass("changed");
            $(".draggdiv").css("transform", "translate(0px, 0px)");
            $(".draggdiv").css("z-index", "1003");
            $(".draggdiv").css("right", "0px");
            $(".publishing").hide();
            $(".notebox").hide();
            $(".pacsbox").show();
            $(".lab").hide();
            $(".unselectable").hide();

            this.pacsVisble = true;

            if (this.firsttimeload) {
                this.firsttimeload = false;
            }
            this.previewD = "none";
            this.pageNum = 2;
        }
        this.mouseeventblock = true;
    }

    /**
     * Determines whether video on
     */
    onVideo() {
        this.draggable = false;
        if (this.pageNum !== 1) {
            $(".subscriber").removeClass("changed");
            //$('.subscriber').css('top', '0px');
            // $('.subscriber').css('right', '200px');

            $(".subscribers").show();
            $(".kart").removeClass("subscriber");

            $(".draggdiv").removeClass("changed");
            $(".draggdiv").css("transform", "translate(0px, 0px)");
            $(".draggdiv").css("z-index", "1");
            $(".publishing").show();
            $(".notebox").hide();
            $(".pacsbox").hide();
            $(".lab").hide();
            $(".unselectable").show();
            this.pacsVisble = false;

            this.previewD = "block";
            this.pageNum = 1;
        }
        this.mouseeventblock = false;
    }

    /**
     * Determines whether notes on
     */
    onNotes() {
        this.draggable = true;
        this.position = { x: 0, y: 0 };

        if (this.pageNum !== 3) {
            $(".subscribers").hide();
            if (!this.isPrimaryStreamKart) {
                // $('.kart').removeClass('primary');
                this.makeKartPrimary();
            }

            $(".kart").addClass("subscriber");
            $(".subscriber").addClass("changed");
            // $('.subscriber').css('left', '');
            // $('.subscriber').css('right', '0px');
            $(".draggdiv").addClass("changed");
            $(".draggdiv").css("z-index", "1");
            $(".draggdiv").css("transform", "translate(0px, 0px)");
            $(".draggdiv").css("right", "0px");
            $(".draggdiv").css("left", "");
            $(".publishing").hide();
            $(".notebox").show();
            $(".pacsbox").hide();
            $(".lab").hide();
            $(".unselectable").hide();
            this.pacsVisble = false;
            this.previewD = "none";
            this.pageNum = 3;
        }
        this.mouseeventblock = true;
    }

    /**
     * Determines whether lab on
     */
    onLab() {
        this.draggable = true;
        if (this.pageNum !== 4) {
            $(".subscribers").hide();
            if (!this.isPrimaryStreamKart) {
                // $('.kart').removeClass('primary');
                this.makeKartPrimary();
            }

            $(".kart").addClass("subscriber");
            $(".subscriber").addClass("changed");
            // $('.subscriber').css('left', '0px');
            $(".draggdiv").addClass("changed");
            $(".draggdiv").css("right", "0px");
            $(".publishing").hide();
            $(".notebox").hide();
            $(".publishing").hide();
            $(".pacsbox").hide();
            $(".lab").show();
            $(".unselectable").hide();
            this.pacsVisble = false;
            this.previewD = "none";
            this.pageNum = 4;
        }
        this.mouseeventblock = true;
    }

    //#endregion

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();
        if (this.isDirectCall == "true") {
            this._signalRService.hubConnection.off("EndpointError");
        }
        this._signalRService.hubConnection.off("GetPACSCredentials");
        this._signalRService.hubConnection.off("StethoscopeDisconnected");
        this._signalRService.hubConnection.off("StreamStethoscope");
        // this._patientinfoservice.patientinfoshare.unsubscribe();
        clearInterval(this.checkInvitesInterval);
        sessionStorage.removeItem("appointmentId");
    }

    /**
     * Ends session
     */
    EndSession() {
        console.log("inside end session");
        const appointmentId = JSON.parse(
            sessionStorage.getItem("appointmentId")
        );
        console.log(appointmentId, "appt id");
        if (appointmentId) {
            this._opdService.EndSession(appointmentId);
            this.directdisconnectCall();
            sessionStorage.removeItem("vidyo");
            sessionStorage.removeItem("reasonForRequest");
            sessionStorage.removeItem("facilityName");
            sessionStorage.removeItem("appointmentId");
        } else {
            const specialistRequestId = this._patientinfoservice.getSpecialistRequestId();
            console.log(specialistRequestId, "specialist request id");
            this._specialistRequestService
                .setSpecialistRequest(specialistRequestId, "EndSession", "")
                .subscribe(
                    (response) => {
                        if (response.status === 200) {
                            this.directdisconnectCall();
                            sessionStorage.removeItem("vidyo");
                            sessionStorage.removeItem("reasonForRequest");
                            sessionStorage.removeItem("facilityName");
                        }
                    },
                    (error) => {
                        this.directdisconnectCall();

                        const msg = new Message();
                        msg.msg = "Something went wrong, please try again.";
                    }
                );
        }
    }

    /**
     * Ends session with survey
     */
    EndSessionWithSurvey() {
        const appointmentId = JSON.parse(
            sessionStorage.getItem("appointmentId")
        );
        if (appointmentId) {
            this._opdService.EndSession(appointmentId).subscribe((res) => {
                if (res.status === 200) {
                    this.disconnectCall();
                    sessionStorage.removeItem("vidyo");
                    sessionStorage.removeItem("reasonForRequest");
                    sessionStorage.removeItem("facilityName");
                    sessionStorage.removeItem("appointmentId");
                }
            },err=>{
                this.disconnectCall();
            });
        } else {
            const specialistRequestId = this._patientinfoservice.getSpecialistRequestId();

            this._specialistRequestService
                .setSpecialistRequest(specialistRequestId, "EndSession", "")
                .subscribe(
                    (response) => {
                        if (response.status === 200) {
                            console.warn(
                                "disconnect called in EndSessionWithSurvey"
                            );
                            this.disconnectCall();
                            sessionStorage.removeItem("vidyo");
                            sessionStorage.removeItem("reasonForRequest");
                            sessionStorage.removeItem("facilityName");
                        }
                    },
                    (error) => {
                        this.disconnectCall();

                        const msg = new Message();
                        msg.msg = "Something went wrong, please try again.";
                    }
                );
        }
    }
    /**
     * On Yes click
     */
    yesClick() {
        this.EndSessionWithSurvey();
    }

    /**
     * canvassetup
     * Configure the canvas for drawing
     * @param canvas HTMLCanvasElement to be configured
     */
    canvassetup(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.canvas.addEventListener("mousedown", (ev) =>
            this.handleMouseDown(ev)
        );
        this.canvas.addEventListener("mouseup", (ev) => this.handleMouseUp(ev));
        this.canvas.addEventListener("mousemove", (ev) =>
            this.handleMouseMove(ev)
        );
        this.canvas.addEventListener("dblclick", (ev) =>
            this.handleMouseDblClick(ev)
        );

        //this.rect = this.canvas.getBoundingClientRect();

        this.canvas.height = window.innerHeight;

        if (this.areMutlipleStreams && this.strokeImagesShown)
        {
            this.canvas.width = window.innerWidth - 200 - 200;
        }else if(this.areMutlipleStreams || this.strokeImagesShown){
            this.canvas.width = window.innerWidth - 200;
        }
        else this.canvas.width = window.innerWidth;

        this.context = this.canvas.getContext("2d");
        console.log(
            "width: ",
            this.canvas.width,
            "height:",
            this.canvas.height
        );

        const mousewheelevt = /Firefox/i.test(navigator.userAgent)
            ? "DOMMouseScroll"
            : "mousewheel";

        this.canvas.addEventListener(mousewheelevt, (ev) =>
            this.handleMouseScroll(ev)
        );

        document.documentElement.addEventListener(
            "gesturestart",
            function (event) {
                event.preventDefault();
            },
            false
        );
        $(document).keydown(function (event) {
            if (
                event.ctrlKey === true &&
                (event.which === 61 ||
                    event.which === 107 ||
                    event.which === 173 ||
                    event.which === 109 ||
                    event.which === 187 ||
                    event.which === 189)
            ) {
                event.preventDefault();
            }
        });
    }

    //#region MouseEvents

    handleMouseScroll(ev: any) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        const currenttime = Date.now();
        if (typeof ev.detail === "number" && ev.detail !== 0) {
            if (ev.detail > 0) {
                this.direction = "Down";
            } else if (ev.detail < 0) {
                this.direction = "Up";
            }
        } else if (typeof ev.wheelDelta === "number") {
            if (ev.wheelDelta < 0) {
                this.direction = "Down";
            } else if (ev.wheelDelta > 0) {
                this.direction = "Up";
            }
        }
        let commandBlock = "";
        if (currenttime > this.lasttime) {
            if (this.getOS() === "MacOS") {
                commandBlock =
                    this.direction === "Up"
                        ? "__cmd__;zoom_out;"
                        : "__cmd__;zoom_in;";
            } else {
                commandBlock =
                    this.direction === "Up"
                        ? "__cmd__;zoom_in;"
                        : "__cmd__;zoom_out;";
            }
            console.log(this.mouseeventblock);

            if (!this.mouseeventblock) {
                this.sendMessage(commandBlock);
            }
        }
        this.lasttime = Date.now() + 25;
    }

    handleMouseDblClick(ev: any) {
        ev.preventDefault();
    }

    handleMouseMove(ev: any) {
        if (this.dragclick) {
            this.rect.w = ev.pageX - this.canvas.offsetLeft - this.rect.startX;
            this.rect.h = this.rect.w;
            this.draw();
        }
        return true;
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        console.log(this.canvas.width, this.canvas.height);

        const x = this.rect.startX;
        const y = this.rect.startY;

        if ($("input[name=Color]:checked").val() === "1") {
            this.context.beginPath();
            this.context.arc(
                x,
                y,
                Math.abs(this.rect.w),
                0,
                2 * Math.PI,
                false
            );
            this.context.lineWidth = 2;
            this.context.strokeStyle = "#00aecd";
            this.context.stroke();
            this.context.closePath();

            this.context.beginPath();
            this.context.fillStyle = "#00aecd";
            this.context.arc(x, y, 2, 0, 2 * Math.PI, true);
            this.context.fill();
            this.context.closePath();
        } else if ($("input[name=Color]:checked").val() === "2") {
            this.context.beginPath();
            this.context.arc(
                x,
                y,
                Math.abs(this.rect.w),
                0,
                2 * Math.PI,
                false
            );
            this.context.lineWidth = 2;
            this.context.strokeStyle = "#28B463";
            this.context.stroke();
            this.context.closePath();

            this.context.beginPath();
            this.context.fillStyle = "#28B463";
            this.context.arc(x, y, 2, 0, 2 * Math.PI, true);
            this.context.fill();
            this.context.closePath();
        }
    }

    handleMouseDown(ev: MouseEvent) {
        let rect = this.canvas.getBoundingClientRect();
        console.log(rect,"rect");
        console.log(ev.pageX,ev.screenX,ev.clientX,ev.offsetX);
        console.log(ev.pageY,ev.screenY,ev.clientY,ev.offsetY);
        this.rect.startX = ev.clientX - rect.left;
        this.rect.startY = ev.clientY - rect.top;
        if (ev.which === 1) {
            this.dragclick = true;
            this.rect.w = 0;
            this.rect.h = 0;

            this.clickCount++;
            if (this.clickCount === 1) {
                this.singleClickTimer = setTimeout(() => {
                    this.clickCount = 0;
                    this.doubleclicked = false;
                    console.log("single click");
                }, 500);
            }
            else if (this.clickCount === 2) {
                this.doubleclicked = true;
                this.clickCount = 0;
                console.log("dblClick");
                clearTimeout(this.singleClickTimer);
            }
        } else if (ev.which === 2) {
        } else if (ev.which === 3) {
        }
    }

    handleMouseUp(ev: MouseEvent): any {
        console.log(ev.which);
        if (ev.which === 1) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.dragclick = false;
            if (this.rect.w === 0) {
                if (this.doubleclicked) {
                    console.log("here");
                    const commandBlock = "__cmd__;zoom_out;";
                    this.sendMessage(commandBlock);
                } else {
                    const commandBlock =
                        "__cmd__;ptz_start;point " +
                        this.rect.startX +
                        " " +
                        this.rect.startY +
                        ";screen_width " +
                        this.canvas.width +
                        ";screen_height " +
                        this.canvas.height +
                        ";ptz_end;";
                    this.sendMessage(commandBlock);
                }
            } else {
                const commandBlock =
                    "__cmd__;ptz_start;point " +
                    this.rect.startX +
                    " " +
                    this.rect.startY +
                    ";rectangle " +
                    Math.abs(this.rect.w * 2) +
                    " " +
                    Math.abs(this.rect.h * 2) +
                    ";screen_width " +
                    this.canvas.width +
                    ";screen_height " +
                    this.canvas.height +
                    ";ptz_end;";
                this.sendMessage(commandBlock);
            }
        } else if (ev.which === 2) {
        } else if (ev.which === 3) {
            const commandBlock = "__cmd__;reset;";
            this.sendMessage(commandBlock);
        }
    }

    //#endregion

    /**
     * Sends message
     * @param commandBlock Message commands
     */
    sendMessage(commandBlock: string) {
        console.log(commandBlock);
        this.session.signal(
            {
                data: commandBlock,
            },
            function (error) {
                if (error) {
                    console.log(
                        "signal error (" + error.name + "): " + error.message
                    );
                } else {
                    console.log("signal sent.");
                }
            }
        );
    }

    /**
     * Gets OS
     * @returns
     */
    getOS() {
        const userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
            windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
            iosPlatforms = ["iPhone", "iPad", "iPod"];
        let os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = "MacOS";
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = "iOS";
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = "Windows";
        } else if (/Android/.test(userAgent)) {
            os = "Android";
        } else if (!os && /Linux/.test(platform)) {
            os = "Linux";
        }

        return os;
    }

    /**
     * Disconnects call
     */
    disconnectCall() {
        clearInterval(this.checkEndpointInterval);
        clearInterval(this.checkPacsInfoInterval);
        console.log("disconnectCall called");
        const commandBlock = "__cmd__;call_disconnect;";
        let signalSent = false;
        this.session.signal(
            {
                data: commandBlock,
                type: "web",
            },
            function (error) {
                if (error) {
                    console.log(
                        "signal error (" + error.name + "): " + error.message
                    );
                } else {
                    signalSent = true;
                }
            }
        );
        setTimeout(() => {
            if (signalSent) {
                this.session.disconnect();
                sessionStorage.removeItem("vidyo");
                sessionStorage.removeItem("reasonForRequest");
                sessionStorage.removeItem("facilityName");
            }
            // // Survey disabled for uat
            this.showSurvey();

            // window.location.href = '/';
        }, 500);
    }

    /**
     * Directdisconnects call
     */
    directdisconnectCall() {
        clearInterval(this.checkEndpointInterval);
        clearInterval(this.checkPacsInfoInterval);
        const commandBlock = "__cmd__;call_disconnect;";
        let signalSent = false;
        if (this.session) {
            this.session.signal(
                {
                    data: commandBlock,
                    type: "web",
                },
                function (error) {
                    if (error) {
                        console.log(
                            "signal error (" +
                                error.name +
                                "): " +
                                error.message
                        );
                    } else {
                        signalSent = true;
                    }
                }
            );
        }
        setTimeout(() => {
            if (signalSent) {
                this.session.disconnect();
                sessionStorage.removeItem("vidyo");
                sessionStorage.removeItem("reasonForRequest");
                sessionStorage.removeItem("facilityName");
            }
            console.log(signalSent, "signal sent");
            console.log(this, "this inside timeout in direct disconnect");
            // window.location.href = '/';
            //this._router.navigate(['/']);
            if (this.isDirectCall == "true") {
                this._router.navigate(["/endpoints"]);
                //window.location.href = environment.endpointsUrl;
            } else {
                this._router.navigate(["/"]);
                //window.location.href = environment.baseURL;
            }

            //window.location.href = environment.baseURL;
        }, 500);
    }

    /**
     * Shows survey
     */
    showSurvey() {
        if (this.surveyShown) {
            return;
        }
        if (this.isAppointment) {
            this.previewD = "none";
            // to solve the issue when end session message box is opened in veedoc and session is ended from veehome
            let msg = new Message();
            this._uiService.closeMsgBox(msg);
            if (this.isDirectCall == "true") {
                this._router.navigate(["/endpoints"]);
                //window.location.href = environment.endpointsUrl;
            } else {
                this._router.navigate(["/"]);
                //window.location.href = environment.baseURL;
            }
            return;
        }
        console.log("showSurvey called");
        // $('.survey').show();
        let msg = new Message();
        // to solve the issue when end session message box is opened in veedoc and session is ended from kart
        this._uiService.closeMsgBox(msg);
        this.surveyShown = true;
        const dialogRef = this._dialogRef.open(SurveyComponent, {
            height: "70vh",
            width: "80vw",
            panelClass: "inviteSpecialistDialog",
        });
        dialogRef.afterClosed().subscribe((fn) => {
            // this._router.navigate(['/']);
            if (this.isDirectCall == "true") {
                //window.location.href = environment.endpointsUrl;
                this._router.navigate(["/endpoints"]);
            } else {
                this._router.navigate(["/"]);
                //window.location.href = environment.baseURL;
            }
        });
        this.previewD = "none";

        // for (let index = 0; index < 4; index++) {
        //     $('.radio-survey[data-index="' + index + '"]').css(
        //         'width',
        //         $('th.ng-star-inserted')
        //             .eq(index)
        //             .width() + this.radioPadding
        //     );
        // }

        // this._router.navigate(['/survey']);
        // window.location.href = '/survey';
        // setTimeout(() => {
        //   window.location.href = '';
        // }, 500);
    }

    fullscreen() {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setTimeout(() => {
                this.canvas.height = window.innerHeight;
            }, 500);
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            setTimeout(() => {
                this.canvas.height = window.innerHeight;
            }, 500);
        }
    }

    //#region SideBar Button Events

    /**
     * Refreshs pacs
     */
    refreshPacs() {
        let signalSent = false;
        const commandBlock = "__cmd__;pacs;";
        this.session.signal(
            {
                data: commandBlock,
            },
            function (error) {
                if (error) {
                    console.log(
                        "signal error (" + error.name + "): " + error.message
                    );
                    console.error("SendChatMsg Failed");
                } else {
                    signalSent = true;
                }
            }
        );
        setTimeout(() => {
            if (signalSent) {
                const msg = new Message();
                msg.msg = "Pacs successfully requested";
                msg.type = "success";
                msg.iconType = "check_circle";
                this._uiService.showToast(msg);
            } else {
                const msg = new Message();
                msg.msg = "Failed to request pacs";
                msg.type = "error";
                msg.iconType = "check_circle";
                this._uiService.showToast(msg);
            }
        }, 500);
    }

    refresh() {
        this.showPacs = false;
        this.showLoader = true;
        this.pacsVisble = false;
        // console.warn("it's getting inside refresh.");
        setTimeout(() => {
            this.showPacs = true;
            this.showLoader = false;
            this.pacsVisble = true;
            // $('.pacsbox').show();
            // console.warn("it's getting here.");
            this.getPacsCredentials();
        }, 1000);
    }

    /**
     * Ondisconnects tokbox component
     */
    ondisconnect() {
        const msg = new Message();
        // msg.msg = this.Mrn;
        msg.msg = "Are you sure you want to end this session?";
        msg.title = "";
        msg.okBtnTitle = "End Session";
        msg.onOkBtnClick = this.yesClick.bind(this);
        msg.showInput = "none";
        this._uiService.showMsgBox(msg);
    }

    /**
     * On message click
     */
    onMessage() {
        const dialogRef = this._dialogRef.open(NurseMessageComponent, {
            width: "600px",
            data: this.appointmentId,
        });
    }

    /**
     * On more click
     */
    onMore() {
        const dialogRef = this._dialogRef.open(PatientInfoComponent, {
            width: "600px",
            data: this.patientInfo,
        });
    }
    /**
     * Stethoscopes button press
     */
    stethoscopeButton() {
        this.stethos = !this.stethos;

        // document
        //     .getElementById('stethoscopeButton')
        //     .classList.add('list-btn-round');
        if (this.stethos) {
            // document.getElementById('stethoscopeButton').classList.add('pulse');
            // document
            //     .getElementById('stethoscopeButton')
            //     .classList.remove('dark');
            console.log(sessionStorage.getItem("endPointId"));
            this._statusService.getUserInfo().subscribe(
                (response) => {
                    if (response) {
                        this._signalRService.hubConnection
                            .invoke(
                                "RequestStethocope",
                                response.userGUID,
                                sessionStorage.getItem("endPointId")
                            )
                            .catch((err) => console.error(err));
                    } else {
                    }
                },
                (error) => {}
            );
        } else {
            // document
            //     .getElementById('stethoscopeButton')
            //     .classList.remove('pulse');
            // document.getElementById('stethoscopeButton').classList.add('dark');

            this._signalRService.hubConnection
                .invoke("StopStream", sessionStorage.getItem("endPointId"))
                .catch((err) => console.error(err));
        }
    }

    /**
     * Microphones button
     */
    microphoneButton() {
        this.microphonePrivacy = !this.microphonePrivacy;

        this.opentokService.PublisherCommands.next({
            type: "microphonePrivacy",
            value: this.microphonePrivacy,
        });
        if (this.microphonePrivacy) {
            document.getElementById("micIcon").classList.remove("icon_vm_mic");
            document.getElementById("micIcon").classList.add("icon_vm_mute");
            document
                .getElementById("microphoneButton")
                .classList.remove("light");
            document.getElementById("microphoneButton").classList.add("dark");
        } else {
            document.getElementById("micIcon").classList.remove("icon_vm_mute");
            document.getElementById("micIcon").classList.add("icon_vm_mic");
            document
                .getElementById("microphoneButton")
                .classList.remove("dark");
            document.getElementById("microphoneButton").classList.add("light");
        }
    }

    /**
     * Cameras button
     */
    cameraButton() {
        this.cameraPrivacy = !this.cameraPrivacy;
        this.opentokService.PublisherCommands.next({
            type: "cameraPrivacy",
            value: this.cameraPrivacy,
        });

        if (this.cameraPrivacy) {
            // Hide the local camera preview, which is in slot 0
            document
                .getElementById("camIcon")
                .classList.remove("icon_vm_video");
            document
                .getElementById("camIcon")
                .classList.add("icon_vm_video_disable");
            document.getElementById("cameraButton").classList.remove("light");
            document.getElementById("cameraButton").classList.add("dark");
        } else {
            // Show the local camera preview, which is in slot 0
            document
                .getElementById("camIcon")
                .classList.remove("icon_vm_video_disable");
            document.getElementById("camIcon").classList.add("icon_vm_video");
            document.getElementById("cameraButton").classList.remove("dark");
            document.getElementById("cameraButton").classList.add("light");
        }
    }

    /**
     * Resetcameras button
     */
    resetcameraButton() {
        const commandBlock = "__cmd__;reset;";
        this.sendMessage(commandBlock);
    }

    //#endregion

    setPrimary(ev) {
        let primarySubscriber = document.getElementsByClassName("primary")[0];
        primarySubscriber.parentNode.removeChild(primarySubscriber);
        primarySubscriber.classList.remove("primary");
        primarySubscriber.classList.add("subscriber");

        console.log(this.primaryStreamId, "primary stream id");
        let primaryInSubscribersDiv = document.getElementById(
            this.primaryStreamId
        );
        primaryInSubscribersDiv.appendChild(primarySubscriber);

        console.log(ev.currentTarget.id, "set primary");
        this.primaryStreamId = ev.currentTarget.id;
        let subscriber = (<HTMLElement>ev.currentTarget).lastElementChild;
        subscriber.parentNode.removeChild(subscriber);
        subscriber.classList.remove("subscriber");
        subscriber.classList.add("primary");

        let draggDiv = document.getElementsByClassName("draggdiv")[0];
        draggDiv.appendChild(subscriber);

        if (subscriber.classList.contains("kart")) {
            console.log("is kart subscriber");
            this.isPrimaryStreamKart = true;
        } else {
            console.log("is kart not subscriber");
            this.isPrimaryStreamKart = false;
        }
    }
    ngAfterViewInit() {
        this.subs.changes.subscribe((d) => {
            // console.log("inside sub changes");
            // let isKartPresent = this.streams.some(x=>x.name.toLowerCase() == "kart");
            // console.log(isKartPresent,"is kart");
            // if(isKartPresent){
            //     let kart = document.getElementsByClassName('kart')[0];
            //     console.log(kart,"kart");
            //     if(kart && !this.primaryStreamId){
            //         this.primaryStreamId = kart.parentElement.id;
            //         console.log(this.primaryStreamId,"primary stream id kart");
            //         kart.parentNode.removeChild(kart);
            //         // let subscriber = kart.parentNode;
            //         // subscriber.parentNode.removeChild(subscriber);
            //         let draggDiv = document.getElementsByClassName('draggdiv')[0];
            //         kart.classList.remove('subscriber');
            //         kart.classList.add('primarysin');
            //         //draggDiv.appendChild(subscriber);
            //         draggDiv.appendChild(kart);
            //     }
            // }else if(this.streams.length > 1 && isKartPresent){
            //     let kart = document.getElementsByClassName('kart')[0];
            //     if(kart){
            //             kart.classList.remove('primarysin');
            //             kart.classList.add('primary');
            //     }
            // }
        });
    }
    childLoaded(ev) {
        console.log(ev, "childloaded");
        if (ev) {
            this.kartLoaded = true;
        }
        if (ev && this.streams.length == 1) {
            setTimeout(() => {
                let kart = document.getElementsByClassName("kart")[0];
                console.log(kart, "kart");
                if (kart) {
                    this.primaryStreamId = kart.parentElement.id;
                    this.isPrimaryStreamKart = true;
                    console.log(this.primaryStreamId, "primary stream id kart");
                    kart.parentNode.removeChild(kart);

                    // let subscriber = kart.parentNode;
                    // subscriber.parentNode.removeChild(subscriber);
                    let draggDiv = document.getElementsByClassName(
                        "draggdiv"
                    )[0];
                    kart.classList.remove("subscriber");
                    kart.classList.add("primarysin");
                    //draggDiv.appendChild(subscriber);
                    draggDiv.appendChild(kart);
                    this.resizeCanvasToDisplaySize(this.canvas);
                }
            }, 300);
        } else if (ev && this.streams.length > 1) {
            console.log("ev true and streams length is greater than 1");
            setTimeout(() => {
                let kart = document.getElementsByClassName("kart")[0];
                console.log(kart, "kart");
                if (kart && this.primaryStreamId) {
                    kart.classList.remove("primarysin");
                    kart.classList.add("primary");
                } else {
                    this.primaryStreamId = kart.parentElement.id;
                    this.isPrimaryStreamKart = true;
                    kart.parentNode.removeChild(kart);

                    let draggDiv = document.getElementsByClassName(
                        "draggdiv"
                    )[0];
                    kart.classList.remove("subscriber");
                    kart.classList.add("primary");
                    draggDiv.appendChild(kart);
                }
                this.resizeCanvasToDisplaySize(this.canvas);
            }, 300);
        } else if (!ev && this.streams.length > 1 && this.kartLoaded) {
            console.log("ev false and streams length is greater than 1");
            setTimeout(() => {
                let kart = document.getElementsByClassName("kart")[0];
                console.log(kart, "kart");
                if (kart && this.primaryStreamId) {
                    kart.classList.remove("primarysin");
                    kart.classList.add("primary");
                }
                this.resizeCanvasToDisplaySize(this.canvas);
            }, 300);
        }
        // so that camera and mic is enabled
        if (!this.cameraPrivacy) {
            this.opentokService.PublisherCommands.next({
                type: "cameraPrivacy",
                value: false,
            });
        }
        if (!this.microphonePrivacy) {
            this.opentokService.PublisherCommands.next({
                type: "microphonePrivacy",
                value: false,
            });
        }
    }

    makeKartPrimary() {
        let primarySubscriber = document.getElementsByClassName("primary")[0];
        primarySubscriber.parentNode.removeChild(primarySubscriber);
        primarySubscriber.classList.remove("primary");
        primarySubscriber.classList.add("subscriber");

        console.log(this.primaryStreamId, "primary stream id");
        let primaryInSubscribersDiv = document.getElementById(
            this.primaryStreamId
        );
        primaryInSubscribersDiv.appendChild(primarySubscriber);

        let kart = document.getElementsByClassName("kart")[0];
        this.primaryStreamId = kart.parentElement.id;
        this.isPrimaryStreamKart = true;
        kart.parentNode.removeChild(kart);
        kart.classList.remove("subscriber");
        kart.classList.add("primary");
        let draggDiv = document.getElementsByClassName("draggdiv")[0];
        draggDiv.appendChild(kart);
    }

    openInterpreterDialog() {
        const dialogRef = this._dialogRef
            .open(InterpreterComponent, {
                width: "400px",
                height: "400px",
                panelClass: "invitedialog",
                data: {
                    facilityId: this.endpointFacilityId,
                    specialistRequestId: this.specialistRequestId,
                    partnerSiteId: this.userPartnerSiteId,
                },
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    openSpecialistDialog() {
        const dialogRef = this._dialogRef
            .open(SpecialistComponent, {
                width: "600px",
                height: "500px",
                panelClass: "inviteSpecialistDialog",
                data: {
                    facilityId: this.endpointFacilityId,
                    specialistRequestId: this.specialistRequestId,
                },
            })
            .afterClosed()
            .subscribe((result) => {});
    }
    openExternalSpecDialog() {
        const dialogRef = this._dialogRef
            .open(ExternalSpecialistComponent, {
                width: "400px",
                height: "400px",
                panelClass: "invitedialog",
                data: {
                    facilityId: this.endpointFacilityId,
                    specialistRequestId: this.specialistRequestId,
                },
            })
            .afterClosed()
            .subscribe((result) => {});
    }
    openOtherDialog() {
        const dialogRef = this._dialogRef
            .open(OtherComponent, {
                width: "400px",
                height: "450px",
                panelClass: "invitedialog",
                data: {
                    facilityId: this.endpointFacilityId,
                    specialistRequestId: this.specialistRequestId,
                },
            })
            .afterClosed()
            .subscribe((result) => {});
    }

    removeFromInvites(ev) {
        this.invites = this.invites.filter((x) => x.inviteGuid != ev);
    }

    toggleHorusScope() {
        this.isHorusScopeOn = !this.isHorusScopeOn;
        sessionStorage.setItem(
            "isHorusScopeOn",
            this.isHorusScopeOn.toString()
        );
        const command = this.isHorusScopeOn
            ? "__cmd__;HORUS_SCOPE_ON;"
            : "__cmd__;HORUS_SCOPE_OFF;";
        this.sendMessage(command);
    }

    // toggleBlur(){
    //     this.isBlurred = !this.isBlurred;
    //     this.videoEffectsServie.changeBlurAmount(this.isBlurred);
    // }

    showStrokeImages() {
        // const dialogRef = this._dialogRef.open(StrokeImagesComponent, {
        //     width: '450px',
        //     height: '520px',
        //     data:{session:this.session}
        // })
        // .afterClosed()
        // .subscribe(result =>{

        // });

        this.strokeImagesShown = !this.strokeImagesShown;
        this.opentokService.StrokeCommands.next(this.strokeImagesShown);
        if(!this.strokeImagesShown){
            const cmd = '__cmd__;CLOSE_NIH_IMAGE;';
            this.sendMessage(cmd);
        }

        this.resizeCanvasToDisplaySize(this.canvas);

    }

    closeStrokeImage() {
        this.strokeImagesShown = !this.strokeImagesShown;
        this.opentokService.StrokeCommands.next(this.strokeImagesShown);
        this.resizeCanvasToDisplaySize(this.canvas);
    }
    showDeniedInviteMessage(invites) {
        invites.forEach((x) => {
            if (!this.deniedInvites.includes(x.inviteGuid)) {
                const msg = new Message();
                msg.msg = "Dr. " + x.participantName + " declined the invite";
                msg.type = "error";
                msg.iconType = "check_circle";
                this._uiService.showToast(msg);
                this.deniedInvites.push(x.inviteGuid);
            }
        });
    }

    resizeCanvasToDisplaySize(canvas) {
        if (this.areMutlipleStreams && this.strokeImagesShown)
        {
            this.canvas.width = window.innerWidth - 200 - 200;
        }else if(this.areMutlipleStreams || this.strokeImagesShown){
            this.canvas.width = window.innerWidth - 200;
        }
        else this.canvas.width = window.innerWidth;
        // look up the size the canvas is being displayed
        // setTimeout(() => {
        //     if (this.areMutlipleStreams) {
        //         const primaryElement = document.getElementsByClassName(
        //             "primary"
        //         )[0];
        //         canvas.width = primaryElement.clientWidth;
        //         canvas.height = primaryElement.clientHeight;
        //     } else {
        //         const primarySingleElement = document.getElementsByClassName(
        //             "primarysin"
        //         )[0];
        //         canvas.width = primarySingleElement.clientWidth;
        //         canvas.height = primarySingleElement.clientHeight;
        //     }
        //     this.rect = canvas.getBoundingClientRect();
        //     this.context = canvas.getContext("2d");
        //     this.rect = {
        //         height: canvas.height,
        //         width: canvas.width,
        //         top: 0,
        //         bottom: canvas.height,
        //         right: canvas.width,
        //         left: 0,
        //         x: 0,
        //         y: 0,
        //         startX: 0,
        //         startY: 0,
        //     };
        //     console.log(this.rect, this.context, "rect and context");
        // }, 100);
        // console.log(canvas.clientWidth,canvas.clientHeight,"canvas");
        // const width = canvas.clientWidth;
        // const height = canvas.clientHeight;

        // // If it's resolution does not match change it
        // if (canvas.width !== width || canvas.height !== height) {
        //   canvas.width = width;
        //   canvas.height = height;
        //   return true;
        // }

        // return false;
    }
}
