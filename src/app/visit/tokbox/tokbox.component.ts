import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Message } from '../../core/models/message';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { SessionInfo } from '../../core/models/sessionInfo.model';
import { StatusService } from '../../core/services/user/status.service';
import { SignalRService } from '../../core/services/signalr/signalr.service';
import { SpecialistRequestService, Accepted } from '../../core/services/specialist/specialistrequests.service';
import { Pacs } from '../../core/main';
import { UIService } from '../../core/services/ui/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientInfoService, PatientInfo } from '../../core/services/specialist/patientinfo.service';
import { OpentokService, StreamStatus } from '../../core/services/Opentok/Opentok.service';
import { OpdService } from '../../core/services/opd/opd.service';
import { MatDialog } from '@angular/material';
import { SurveyService } from '../../core/services/survey/survey.service';
import { InviteService } from '../../core/services/invites/invite.service';
import { VideoEffectsService } from '../../core/services/videoeffects/video-effects.service';
import { Moment } from 'moment';
import * as moment from 'moment';
declare var $;
declare var buffer;

@Component({
  selector: 'app-tokbox',
  templateUrl: './tokbox.component.html',
  styleUrls: ['./tokbox.component.css']
})
export class InviteTokboxComponent implements OnInit, OnDestroy {
    dynamicNotesData;
    endpointFacilityName;
    endpointSerialNumber;
    endpointFacilityId;
    specialistRequestId;

    specialityName;
    endPoint;

    pageNum = 1;

    previewD = 'block';

    Type: any;
    Name = 'loading....';
    Gender: any;
    Hospital: string;
    LastWellKnownDate: any;
    Mrn: any;
    PhysicianCell: any;
    PhysicianName: any;
    Age: string | number;
    reasonForRequest: string;
    videoLoader = 'none';
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
    public rect;
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
    isEndpointError : boolean = false;
    endpointErrorMessage: string ='';
    endpointName:string = '';
    endpointLocation:string = '';
    animate1;
    animate2;
    animate3;
    showOptionBeforeConnectTimeout;
    veemedSupportNumber = '+1(800) 558-0022';
    notifier = new Subject(); //to be used with take untill to unsubscribe in ng on destroy
    checkPacsInfoInterval;
    surveyShown : boolean = false;
    primaryStreamId: string;
    areMutlipleStreams:boolean = false;
    kartLoaded:boolean = false;
    isPrimaryStreamKart : boolean = false;

    isMicMuted:boolean = false;
    isVideoMuted:boolean = false;

    inviteGuid:string;
    isBlurred:boolean = false;

    cartoffline = false;
    specialistOffline = false;
    secondsRemainSpecialistInterval;
    secondsRemainKartInterval;
    minutesRemainSpecialist;
    minutesRemainKart;

    constructor(
        private _signalRService: SignalRService,
        // private _specialistRequestService: SpecialistRequestService,
        // private _appointmentService: AppointmentService,
        //private viewer: Pacs,
        private _uiService: UIService,
        // private _route: ActivatedRoute,
        private _router: Router,
        private _patientinfoservice: PatientInfoService,
        private opentokService: OpentokService,
        ref: ChangeDetectorRef,
        // private _opdService: OpdService,
        // private _dialogRef: MatDialog,
        // private _surveyService: SurveyService,
        private inviteService :InviteService,
        private location: Location,
        private zone: NgZone
        // private videoEffectsServie:VideoEffectsService

    ) {
        this.changeDetectorRef = ref;
    }

    ngOnInit() {
        if(sessionStorage.getItem('isMicMuted')){
            let bool =  sessionStorage.getItem('isMicMuted') === 'true' ;
            this.toggleMic(bool);
        }
        if(sessionStorage.getItem('isVideoMuted')){
            let bool =  sessionStorage.getItem('isVideoMuted') === 'true' ;
            this.toggleVideo(bool);
        }

        if(sessionStorage.getItem('inviteGuid')){
            this.inviteGuid =  sessionStorage.getItem('inviteGuid');
        }
        this.showoptionbeforeconnect();
        this.Connect();
        this.callanimate();

        // this._signalRService.hubConnection.on(
        //     'GetPACSCredentials',
        //     (username, password) => {
        //         this.viewer.Authenticate(username, password, '', '', this.Mrn);
        //     }
        // );

        // this._signalRService.hubConnection.on(
        //     'StethoscopeDisconnected',
        //     (message) => {
        //         this.stopStethoscope();
        //     }
        // );

        // this._signalRService.hubConnection.on('StreamStethoscope', message => {
        //     if (this.stethos) {
        //         buffer.addChunk(message);
        //     }
        // });



    }
    // stopStethoscope() {
    //     this.stethos = false;
    //     document
    //         .getElementById('stethoscopeButton')
    //         .classList.remove('pulse');
    //     document.getElementById('stethoscopeButton').classList.add('dark');

    //     this._signalRService.hubConnection
    //         .invoke('StopStream', sessionStorage.getItem('endPointId'))
    //         .catch(err => console.error(err));
    // }



    setpatintinfo() {
        if (this.isAppointment) {
            const timeDiff = Math.abs(
                Date.now() - Date.parse(this.patientInfo.dob)
            );
            this.Name =
                this.patientInfo.firstName + ' ' + this.patientInfo.lastName;

            this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
            if (this.Age === 0) {
                this.Age =
                    Math.floor(timeDiff / (1000 * 3600 * 24) / 30) + ' month';
            } else if (this.Age === 0) {
                this.Age = Math.floor(timeDiff / (1000 * 3600 * 24)) + ' days';
            }

            this.Gender = this.patientInfo.gender;
            this.Mrn = this.patientInfo.mrn;

            this.HeartRate = this.patientInfo.heartRate;
            this.TopBloodPressure = this.patientInfo.topBloodPressure;
            this.BottomBloodPressure = this.patientInfo.bottomBloodPressure;
            this.Temperature = this.patientInfo.temperature;

            console.error('setpatintinfo');
            this._patientinfoservice
                .checkpatinentpacsinfo(this.patientInfo.mrn)
                .pipe(takeUntil(this.notifier))
                .subscribe(
                    response => {
                        if (response.status === 200) {
                           // this.getPacsCredentials();
                        }
                    },
                    error => {
                        this.checkforpacinfo();
                    }
                );
        } else {
            this._patientinfoservice.receivepatientinfo()
            .pipe(takeUntil(this.notifier))
            .subscribe(data => {
                console.log('data in receivepatientinfo', data);
                const timeDiff = Math.abs(Date.now() - Date.parse(data.dob));
                this.Name = data.firstName + ' ' + data.lastName;

                this.Age = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
                if (this.Age === 0) {
                    this.Age =
                        Math.floor(timeDiff / (1000 * 3600 * 24) / 30) +
                        ' month';
                } else if (this.Age === 0) {
                    this.Age =
                        Math.floor(timeDiff / (1000 * 3600 * 24)) + ' days';
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

                console.error('setpatintinfo');
                this._patientinfoservice
                    .checkpatinentpacsinfo(data.mrn)
                    .pipe(takeUntil(this.notifier))
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                // this.getPacsCredentials();
                            }
                        },
                        error => {
                            this.checkforpacinfo();
                        }
                    );
            });
        }
    }

    // getPacsCredentials() {
    //     console.log('getPacsCredentials');
    //     console.log(
    //         'this._signalRService.ishubConnection',
    //         this._signalRService.ishubConnection
    //     );
    //     if (this._signalRService.ishubConnection) {
    //         this._signalRService.hubConnection.invoke('GetPACSCredentials');

    //         this.showPacs = true;
    //         this.Pacsshow = true;
    //         this.stopinterval = true;
    //         if (this.pageNum === 2) {
    //             $('.pacsbox').show();
    //         }
    //     } else {
    //         setTimeout(() => {
    //             this.getPacsCredentials();
    //         }, 2000);
    //     }
    // }

    // findPatientStudy(val) {
    //     this.viewer.findStudy(val);
    // }

    checkforpatientinfo() {
        const specialistRequestId = this._patientinfoservice.getSpecialistRequestId();

        this._patientinfoservice.getpatientInfo(specialistRequestId).pipe(takeUntil(this.notifier)).subscribe(
            patientinfo => {
                this.patientInfo = JSON.parse(patientinfo._body);
                this._patientinfoservice.sendpatientinfo(this.patientInfo);
            },
            err => {
                setTimeout(() => {
                    this.checkforpatientinfo();
                }, 1000);
            }
        );
    }

    checkforpacinfo() {
        console.error('checkforpacinfo');
        this.checkPacsInfoInterval = setInterval(() => {
            if (!this.stopinterval) {
                this._patientinfoservice
                    .checkpatinentpacsinfo(this.patientInfo.mrn)
                    .pipe(takeUntil(this.notifier))
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                // this.getPacsCredentials();
                            }
                        },
                        error => { }
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
            document.getElementById('connecting-text-0').style.display = 'none';
            document.getElementById('connecting-1').style.visibility =
                'visible';
            document.getElementById('connecting-text-1').style.display =
                'block';
        }, 0);

        this.animate2 = setTimeout(() => {
            document.getElementById('connecting-line-1').style.display =
                'block';
            document.getElementById('connecting-1').style.visibility = 'hidden';
            document.getElementById('connecting-2').style.visibility =
                'visible';

            document.getElementById('connecting-text-1').style.display = 'none';
            document.getElementById('connecting-text-2').style.display =
                'block';
        }, 3500);

       this.animate3 =  setTimeout(() => {
            document.getElementById('connecting-line-2').style.display =
                'block';
            document.getElementById('connecting-1').style.visibility = 'hidden';
            document.getElementById('connecting-2').style.visibility = 'hidden';
            document.getElementById('connecting-3').style.visibility =
                'visible';

            document.getElementById('connecting-text-1').style.display = 'none';
            document.getElementById('connecting-text-2').style.display = 'none';
            document.getElementById('connecting-text-3').style.display =
                'block';
        }, 7000);
    }



    Connect() {

        if (sessionStorage.getItem('SessionInfo')) {
            const EndpointSessionInfo: Accepted = JSON.parse(
                sessionStorage.getItem('SessionInfo')
            );
            this.specialistRequestId = EndpointSessionInfo.specialistRequestId;

            this.joinTokBox(EndpointSessionInfo);

        }
    }

    /**
     * Joins tokbox client with the session using the opentokSevice
     * @param EndpointSessionInfo
     */
    joinTokBox(EndpointSessionInfo: Accepted) {
        console.log(
            'joinTokBox called with EndpointSessionInfo: ',
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
            .catch(err => {
                console.error('error occured:', err);
                this.showReconnectOption();
                // this._router.navigate(['/home']);
                // window.location.href = '';
            });
    }

    showReconnectOption() {
        document.getElementById('sessionEndOption').style.display = 'block';
        document.getElementById('connecting-line-3').style.display = 'block';
        document.getElementById('connecting-1').style.visibility = 'hidden';
        document.getElementById('connecting-2').style.visibility = 'hidden';
        document.getElementById('connecting-3').style.visibility = 'hidden';
        document.getElementById('connecting-text-1').style.display = 'none';
        document.getElementById('connecting-text-2').style.display = 'none';
        document.getElementById('connecting-text-3').style.display = 'none';
        document.getElementById('material-icons-4').style.color = 'red';
        this.opentokService.PublisherCommands.next({
            type: 'cameraPrivacy',
            value: true
        });
        this.opentokService.PublisherCommands.next({
            type: 'microphonePrivacy',
            value: true
        });
    }


    /**
     * Configure the session and the session events
     * @param session type: OT.Session
     */
    private ConfigSession(session: OT.Session) {
        console.log('ConfigSession called');
        this.session = session;
        this.session.on('streamCreated', event => {
            console.log('Stream Careated: ', event.stream);
            this.streams.push(event.stream);

            this.changeDetectorRef.detectChanges();
            const streamNameObject = JSON.parse(event.stream.name);
            if(streamNameObject.isPrimary){
                clearInterval(this.secondsRemainSpecialistInterval);
            } else if(streamNameObject.name.toLowerCase() == 'patient'){
                clearInterval(this.secondsRemainKartInterval);
            }
            if(this.streams.length > 1){

                // let kart = document.getElementsByClassName('kart')[0];
                // if(kart){
                //         kart.classList.remove('primarysin');
                //         kart.classList.add('primary');

                // }
                this.areMutlipleStreams = true;
            }

        });
        this.session.on('streamDestroyed', event => {
            const idx = this.streams.indexOf(event.stream);
            const streamNameObject = JSON.parse(event.stream.name);
            if(streamNameObject.isPrimary){
                // m for minutes
                const currentTimePlusFiveMin = moment().add(5,'m');
                this.secondsRemainSpecialistInterval = setInterval(()=>{
                    this.timer(currentTimePlusFiveMin,true);
                },1000);
            }else if(streamNameObject.name.toLowerCase() == 'patient'){
                // m for minutes
                const currentTimePlusFiveMin = moment().add(5,'m');
                this.secondsRemainKartInterval= setInterval(()=>{
                    this.timer(currentTimePlusFiveMin,false);
                },1000);
            }

            if (idx > -1) {
                console.log("inside stream destroyed if");
                this.streams.splice(idx, 1);
                this.changeDetectorRef.detectChanges();

                if(this.streams.length== 1){
                    this.areMutlipleStreams = false;
                    let kart = document.getElementsByClassName('kart')[0];
                    if(kart){
                        if(kart.classList.contains('primary')){
                            kart.classList.remove('primary');
                            kart.classList.add('primarysin');
                        }else{
                            this.primaryStreamId = kart.parentElement.id;
                            this.isPrimaryStreamKart = true;
                            console.log(this.primaryStreamId,"primary stream id kart");
                            kart.parentNode.removeChild(kart);

                            // let subscriber = kart.parentNode;
                            // subscriber.parentNode.removeChild(subscriber);
                            let draggDiv = document.getElementsByClassName('draggdiv')[0];
                            kart.classList.remove('subscriber');
                            kart.classList.add('primarysin');
                            //draggDiv.appendChild(subscriber);
                            draggDiv.appendChild(kart);
                        }

                    }

                }
            }
        });
        const self = this;

        // Subcribe on session signanl call_disconnectfromKart
        this.session.on('signal', function (event) {
            // disregard the error flag
            if (event.type.toLowerCase() === 'signal:web') {
                if (event.data === '__cmd__;call_disconnect;') {
                    self.session.disconnect();
                    self.disconnectFromKart = true;
                    console.log("disconnect web called");
                    sessionStorage.removeItem('SessionInfo');
                    this.inviteService.endInvite(this.inviteGuid).subscribe(d=>{

                    });
                    // self._router.navigate(['/']);
                    self.location.go('/home');
                    self.reloadPage();

                }
            } else if (event.type.toLowerCase() === 'signal:kart') {
                if (event.data === '__cmd__;call_disconnectfromKart;') {
                    console.log('here');
                    $('.kartdisconect').fadeIn();
                    self.session.disconnect();
                    self.disconnectFromKart = true;
                    this.inviteService.endInvite(this.inviteGuid).subscribe(d=>{

                    });
                    setTimeout(() => {
                        $('#publishVideo').hide();
                        $('.kartdisconect').fadeOut();
                        sessionStorage.removeItem('SessionInfo');


                        // self._router.navigate(['/']);
                        self.location.go('/home');
                        self.reloadPage();
                    }, 1000);
                }
            }  else if(event.data.toLowerCase() === '__cmd__;mute'){
                this.toggleMic(true);
            }else if(event.data.toLowerCase() === '__cmd__;unmute'){
                this.toggleMic(false);
            }else if(event.data.toLowerCase() === '__cmd__;videoon'){
                this.toggleVideo(false);
            }else if(event.data.toLowerCase() === '__cmd__;videooff'){
                this.toggleVideo(true);
            }else if(event.data.toLowerCase() === '__cmd__;block'){
                self.session.disconnect();
                self.disconnectFromKart = true;
                this.inviteService.endInvite(this.inviteGuid).subscribe(d=>{

                });
                console.log("disconnect web called");

                    sessionStorage.removeItem('SessionInfo');
                    // self._router.navigate(['/']);
                    self.location.go('/home');
                    self.reloadPage();

            }
        }, self);

        // Subscribe on kart connects/disconnects
        this.opentokService.SubscriberCommands.pipe(takeUntil(this.notifier)).subscribe((status: StreamStatus) => {
            switch (status.streamStatus) {
                case 'connected':
                    console.log('kart connected');
                    this.endAnimate();
                    this.opentokService.PublisherCommands.next({
                        type: 'cameraPrivacy',
                        value: false
                    });
                    this.opentokService.PublisherCommands.next({
                        type: 'microphonePrivacy',
                        value: false
                    });
                    // $('.cartoffline').fadeOut();
                    if(status.isPrimarySpecialist){
                        this.specialistOffline = false;
                    } else if(status.isKart){
                        this.cartoffline = false;
                    }
                    $('.online').fadeOut();
                    break;
                case 'destroyed':
                    if(status.isPrimarySpecialist){
                        this.specialistOffline = true;
                    }else if(status.isKart){
                        this.cartoffline = true;
                    }
                    console.log('kart disconnects');
                    // $('.cartoffline').fadeIn();
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
                console.log('inside call connecting if');
                this.opentokService.PublisherCommands.next({
                    type: 'cameraPrivacy',
                    value: false
                });
                this.opentokService.PublisherCommands.next({
                    type: 'microphonePrivacy',
                    value: false
                });
                this.endAnimate();
            } else {
                console.log("inside call connecting else");
                this.showReconnectOption();
            }
        }, 30000);
        $('#connectionStatus').html('Ready to Connect');
        $('#helper').addClass('hidden');
        $('#toolbarLeft').removeClass('hidden');
        $('#toolbarCenter').removeClass('hidden');
        $('#toolbarRight').removeClass('hidden');

        window.addEventListener('online', this.updateOnlineStatus);
        window.addEventListener('offline', this.updateOnlineStatus);
    }


    /**
     * Updates online status
     * @param event
     */
    updateOnlineStatus(event) {
        const condition = navigator.onLine ? 'online' : 'offline';
        switch (condition) {
            case 'online':
                $('.offline').fadeOut();
                $('.online').fadeIn();
                break;

            case 'offline':
                $('.online').fadeOut();
                $('.offline').fadeIn();
                break;

            default:
                break;
        }
    }


    //#region Navigation Actions

    onSpecialist() {
        const msg = new Message();
        msg.msg = 'Select a specilist';
        msg.title = '';
        msg.okBtnTitle = null;
        msg.onOkBtnClick = null;
        msg.cancelBtnTitle = 'OK';
        msg.showInput = 'addSpec';
        this._uiService.showMsgBox(msg);
    }

    /**
     * Determines whether pacs on
     */
    onPacs() {
        this.draggable = true;
        this.position = { x: 0, y: 0 };
        if (this.pageNum !== 2) {
            $('.subscribers').hide();
            if(!this.isPrimaryStreamKart){
                // $('.kart').removeClass('primary');
                this.makeKartPrimary();
            }

            $('.kart').addClass('subscriber');
            $('.subscriber').addClass('changed');
            // $('.subscriber').css('left', '0px');

            $('.draggdiv').addClass('changed');
            $('.draggdiv').css('transform', 'translate(0px, 0px)');
            $('.draggdiv').css('z-index', '1003');
            $('.draggdiv').css('right', '0px');
            $('.publishing').hide();
            $('.notebox').hide();
            $('.pacsbox').show();
            $('.lab').hide();

            this.pacsVisble = true;

            if (this.firsttimeload) {
                this.firsttimeload = false;
            }
            this.previewD = 'none';
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

            $('.subscriber').removeClass('changed');
            //$('.subscriber').css('top', '0px');
            // $('.subscriber').css('right', '200px');

            $('.subscribers').show();
            $('.kart').removeClass('subscriber');

            $('.draggdiv').removeClass('changed');
            $('.draggdiv').css('transform', 'translate(0px, 0px)');
            $('.draggdiv').css('z-index', '1');
            $('.publishing').show();
            $('.notebox').hide();
            $('.pacsbox').hide();
            $('.lab').hide();
            this.pacsVisble = false;

            this.previewD = 'block';
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
            $('.subscribers').hide();
            if(!this.isPrimaryStreamKart){
                // $('.kart').removeClass('primary');
                this.makeKartPrimary();
            }

            $('.kart').addClass('subscriber');
            $('.subscriber').addClass('changed');
            // $('.subscriber').css('left', '');
            // $('.subscriber').css('right', '0px');
            $('.draggdiv').addClass('changed');
            $('.draggdiv').css('z-index', '1');
            $('.draggdiv').css('transform', 'translate(0px, 0px)');
            $('.draggdiv').css('right', '0px');
            $('.draggdiv').css('left', '');
            $('.publishing').hide();
            $('.notebox').show();
            $('.pacsbox').hide();
            $('.lab').hide();
            this.pacsVisble = false;
            this.previewD = 'none';
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
            $('.subscribers').hide();
            if(!this.isPrimaryStreamKart){
                // $('.kart').removeClass('primary');
                this.makeKartPrimary();
            }

            $('.kart').addClass('subscriber');
            $('.subscriber').addClass('changed');
            // $('.subscriber').css('left', '0px');
            $('.draggdiv').addClass('changed');
            $('.draggdiv').css('right', '0px');
            $('.publishing').hide();
            $('.notebox').hide();
            $('.publishing').hide();
            $('.pacsbox').hide();
            $('.lab').show();
            this.pacsVisble = false;
            this.previewD = 'none';
            this.pageNum = 4;
        }
        this.mouseeventblock = true;
    }

    //#endregion

    ngOnDestroy() {
        this.notifier.next();
        this.notifier.complete();

        // this._signalRService.hubConnection.off('GetPACSCredentials');
        // this._signalRService.hubConnection.off('StethoscopeDisconnected');
        // this._signalRService.hubConnection.off('StreamStethoscope');
        // this._patientinfoservice.patientinfoshare.unsubscribe();
        this.session.disconnect();
        this.opentokService.session = null;
        this.changeDetectorRef.detach();
        clearInterval(this.secondsRemainSpecialistInterval);
        clearInterval(this.secondsRemainKartInterval);
        sessionStorage.removeItem('isMicMuted');
        sessionStorage.removeItem('isVideoMuted');
        sessionStorage.removeItem('inviteGuid');
        console.log('ngondestro called');
    }

    /**
     * Ends session
     */
    EndSession() {
        this.directdisconnectCall();
        sessionStorage.removeItem('SessionInfo');
        sessionStorage.removeItem('inviteGuid');
    }


    /**
     * On Yes click
     */
    yesClick() {
        this.EndSession();
    }


    /**
     * Sends message
     * @param commandBlock Message commands
     */
    sendMessage(commandBlock: string) {
        console.log(commandBlock);
        this.session.signal(
            {
                data: commandBlock
            },
            function (error) {
                if (error) {
                    console.log(
                        'signal error (' + error.name + '): ' + error.message
                    );
                } else {
                    console.log('signal sent.');
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
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        let os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'MacOS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    /**
     * Directdisconnects call
     */
    directdisconnectCall() {
console.log('directdisconnectCall');
        clearInterval(this.checkPacsInfoInterval);

        setTimeout(() => {
            this.opentokService.session.disconnect();
            this.session.disconnect();
            sessionStorage.removeItem('SessionInfo');
            this.inviteService.endInvite(this.inviteGuid).subscribe(d=>{

            });
            this.location.go('/home');
            this.reloadPage();
            // this._router.navigate(['/home']);
        }, 500);
    }
    reloadPage() {
        return this.zone.runOutsideAngular(() => {
            location.reload()
        });
    }



    //#region SideBar Button Events

    /**
     * Refreshs pacs
     */
    refreshPacs() {
        let signalSent = false;
        const commandBlock = '__cmd__;pacs;';
        this.session.signal(
            {
                data: commandBlock
            },
            function (error) {
                if (error) {
                    console.log(
                        'signal error (' + error.name + '): ' + error.message
                    );
                    console.error('SendChatMsg Failed');
                } else {
                    signalSent = true;
                }
            }
        );
        setTimeout(() => {
            if (signalSent) {
                const msg = new Message();
                msg.msg = 'Pacs successfully requested';
                msg.type = 'success';
                msg.iconType = 'check_circle';
                this._uiService.showToast(msg);
            } else {
                const msg = new Message();
                msg.msg = 'Failed to request pacs';
                msg.type = 'error';
                msg.iconType = 'check_circle';
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
            //this.getPacsCredentials();
        }, 1000);
    }

    /**
     * Ondisconnects tokbox component
     */
    ondisconnect() {
        const msg = new Message();
        // msg.msg = this.Mrn;
        msg.msg = 'Are you sure you want to leave this session ?';
        msg.title = '';
        msg.okBtnTitle = 'Leave';
        msg.onOkBtnClick = this.yesClick.bind(this);
        msg.showInput = 'none';
        this._uiService.showMsgBox(msg);
    }



        /**
     * Microphones button
     */
    microphoneButton() {
        this.microphonePrivacy = !this.microphonePrivacy;

        this.opentokService.PublisherCommands.next({
            type: 'microphonePrivacy',
            value: this.microphonePrivacy
        });
        if (this.microphonePrivacy) {
            document.getElementById('micIcon').classList.remove('icon_vm_mic');
            document.getElementById('micIcon').classList.add('icon_vm_mute');
            document
                .getElementById('microphoneButton')
                .classList.remove('light');
            document.getElementById('microphoneButton').classList.add('dark');
        } else {
            document.getElementById('micIcon').classList.remove('icon_vm_mute');
            document.getElementById('micIcon').classList.add('icon_vm_mic');
            document
                .getElementById('microphoneButton')
                .classList.remove('dark');
            document.getElementById('microphoneButton').classList.add('light');
        }
    }

    /**
     * Cameras button
     */
    cameraButton() {
        this.cameraPrivacy = !this.cameraPrivacy;
        this.opentokService.PublisherCommands.next({
            type: 'cameraPrivacy',
            value: this.cameraPrivacy
        });

        if (this.cameraPrivacy) {
            // Hide the local camera preview, which is in slot 0
            document
                .getElementById('camIcon')
                .classList.remove('icon_vm_video');
            document
                .getElementById('camIcon')
                .classList.add('icon_vm_video_disable');
            document.getElementById('cameraButton').classList.remove('light');
            document.getElementById('cameraButton').classList.add('dark');
        } else {
            // Show the local camera preview, which is in slot 0
            document
                .getElementById('camIcon')
                .classList.remove('icon_vm_video_disable');
            document.getElementById('camIcon').classList.add('icon_vm_video');
            document.getElementById('cameraButton').classList.remove('dark');
            document.getElementById('cameraButton').classList.add('light');
        }
    }


    //#endregion

    setPrimary(ev){
        let primarySubscriber =document.getElementsByClassName('primary')[0];
        primarySubscriber.parentNode.removeChild(primarySubscriber);
        primarySubscriber.classList.remove('primary');
        primarySubscriber.classList.add('subscriber');

        console.log(this.primaryStreamId , "primary stream id");
        let primaryInSubscribersDiv = document.getElementById(this.primaryStreamId);
        primaryInSubscribersDiv.appendChild(primarySubscriber);



        console.log(ev.currentTarget.id,"set primary");
        this.primaryStreamId = ev.currentTarget.id;
        let subscriber = (<HTMLElement>ev.currentTarget).lastElementChild;
        subscriber.parentNode.removeChild(subscriber);
        subscriber.classList.remove('subscriber');
        subscriber.classList.add('primary');



        let draggDiv = document.getElementsByClassName('draggdiv')[0];
        draggDiv.appendChild(subscriber);

        if(subscriber.classList.contains('kart')){
            console.log("is kart subscriber");
            this.isPrimaryStreamKart = true;
        }else{
            console.log("is kart not subscriber");
            this.isPrimaryStreamKart = false;
        }
    }

    childLoaded(ev){
        console.log(ev,"childloaded");
        if(ev){
            this.kartLoaded =true ;
        }
        if(ev && this.streams.length == 1){
            setTimeout(()=>{
                let kart = document.getElementsByClassName('kart')[0];
                console.log(kart,"kart");
                if(kart){
                    this.primaryStreamId = kart.parentElement.id;
                    this.isPrimaryStreamKart = true;
                    console.log(this.primaryStreamId,"primary stream id kart");
                    kart.parentNode.removeChild(kart);

                    // let subscriber = kart.parentNode;
                    // subscriber.parentNode.removeChild(subscriber);
                    let draggDiv = document.getElementsByClassName('draggdiv')[0];
                    kart.classList.remove('subscriber');
                    kart.classList.add('primarysin');
                    //draggDiv.appendChild(subscriber);
                    draggDiv.appendChild(kart);
                }
            },300);

        }else if(ev && this.streams.length>1){
            console.log("ev true and streams length is greater than 1")
            setTimeout(()=>{
                let kart = document.getElementsByClassName('kart')[0];
                console.log(kart,"kart");
                if(kart && this.primaryStreamId){
                    kart.classList.remove('primarysin');
                    kart.classList.add('primary');
                }else{
                    this.primaryStreamId = kart.parentElement.id;
                    this.isPrimaryStreamKart = true;
                    kart.parentNode.removeChild(kart);

                    let draggDiv = document.getElementsByClassName('draggdiv')[0];
                    kart.classList.remove('subscriber');
                    kart.classList.add('primary');
                    draggDiv.appendChild(kart);
                }
            },300);

        }
        else if(!ev && this.streams.length>1 && this.kartLoaded){
            console.log("ev false and streams length is greater than 1")
            setTimeout(()=>{
                let kart = document.getElementsByClassName('kart')[0];
                console.log(kart,"kart");
                if(kart && this.primaryStreamId){
                    kart.classList.remove('primarysin');
                    kart.classList.add('primary');
                }
            },300);

        }

    }

    makeKartPrimary(){
        let primarySubscriber =document.getElementsByClassName('primary')[0];
        primarySubscriber.parentNode.removeChild(primarySubscriber);
        primarySubscriber.classList.remove('primary');
        primarySubscriber.classList.add('subscriber');

        console.log(this.primaryStreamId , "primary stream id");
        let primaryInSubscribersDiv = document.getElementById(this.primaryStreamId);
        primaryInSubscribersDiv.appendChild(primarySubscriber);



        let kart = document.getElementsByClassName('kart')[0];
        this.primaryStreamId = kart.parentElement.id;
        this.isPrimaryStreamKart = true;
        kart.parentNode.removeChild(kart);
        kart.classList.remove('subscriber');
        kart.classList.add('primary');
        let draggDiv = document.getElementsByClassName('draggdiv')[0];
        draggDiv.appendChild(kart);
    }


    endAnimate() {
        document.getElementById('call-connecting').style.display = 'none';
        clearTimeout(this.callConnectingTimer);
        clearTimeout(this.animate1);
        clearTimeout(this.animate2);
        clearTimeout(this.animate3);
        clearTimeout(this.showOptionBeforeConnectTimeout);

    }

    showoptionbeforeconnect() {
        this.showOptionBeforeConnectTimeout = setTimeout(() => {
            document.getElementById('sessionEndOption').style.display = 'block';
            document.getElementById('connecting-line-3').style.display = 'block';
            document.getElementById('connecting-1').style.visibility = 'hidden';
            document.getElementById('connecting-2').style.visibility = 'hidden';
            document.getElementById('connecting-3').style.visibility = 'hidden';
            document.getElementById('connecting-text-1').style.display = 'none';
            document.getElementById('connecting-text-2').style.display = 'none';
            document.getElementById('connecting-text-3').style.display = 'none';
            document.getElementById('material-icons-4').style.color = 'red';
        }, 60000);
    }

    toggleMic(muteMic:boolean){

        if(muteMic){
            this.isMicMuted = true;
            this.microphonePrivacy = this.isMicMuted;
            sessionStorage.setItem('isMicMuted',this.isMicMuted.toString());
            console.log("mute mic", muteMic);
            this.opentokService.PublisherCommands.next({
                type: 'microphonePrivacy',
                value: this.microphonePrivacy
            });
        }else{
            this.isMicMuted = false;
            this.microphonePrivacy = this.isMicMuted;
            sessionStorage.setItem('isMicMuted',this.isMicMuted.toString());
            console.log("mute mic", muteMic);
            this.opentokService.PublisherCommands.next({
                type: 'microphonePrivacy',
                value: this.microphonePrivacy
            });
        }

    }

    toggleVideo(muteVideo:boolean){
        if(muteVideo){
            this.isVideoMuted = true;
            this.cameraPrivacy = this.isVideoMuted;
            sessionStorage.setItem('isVideoMuted',this.isVideoMuted.toString());
            console.log("mute video",muteVideo);
            this.opentokService.PublisherCommands.next({
                type: 'cameraPrivacy',
                value: this.cameraPrivacy
            });
        }else{
            this.isVideoMuted = false;
            this.cameraPrivacy = this.isVideoMuted;
            sessionStorage.setItem('isVideoMuted',this.isVideoMuted.toString());
            console.log("mute video",muteVideo);
            this.opentokService.PublisherCommands.next({
                type: 'cameraPrivacy',
                value: this.cameraPrivacy
            });
        }

    }

    timer( currentTimeWithFiveMin:Moment,isForSpecialist:boolean){

        let diffTime;
        let duration;
        const todaysdate = moment();
        diffTime = currentTimeWithFiveMin.diff(todaysdate);
        duration = moment.duration(diffTime);
        console.log(duration,"duration");
        console.log(currentTimeWithFiveMin,"current time with 5 min");
        if(isForSpecialist){
            this.minutesRemainSpecialist = duration.minutes();
        }else{
            this.minutesRemainKart = duration.minutes();
        }
        console.log(this.minutesRemainKart , "kart seconds");
        console.log(this.minutesRemainSpecialist,"specialist seconds");

        if (this.minutesRemainSpecialist === 0) {
            //this.startProcess();
            clearInterval(this.secondsRemainSpecialistInterval);
            this.EndSession();
        }
        if (this.minutesRemainKart === 0) {
            //this.startProcess();
            clearInterval(this.secondsRemainKartInterval);
            this.EndSession();
        }
    }

    // toggleBlur(){
    //     this.isBlurred = !this.isBlurred;
    //     this.videoEffectsServie.changeBlurAmount(this.isBlurred);
    // }

}
