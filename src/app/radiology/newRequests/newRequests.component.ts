import { Component, OnInit, Inject, ViewChild } from '@angular/core'
import { UIService } from "../../core/services/ui/ui.service";
import { Message } from "../../core/models/message";
import { AuthService } from '../../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { CountBubble } from './../../core/services/specialist/countbubble.service';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SignalRService } from './../../core/services/signalr/signalr.service';
import { PatientInfoService, PatientInfo } from "./../../core/services/specialist/patientinfo.service";
import { MessageService } from './../../core/services/specialist/message.service'
import { ISubscription } from "rxjs/Subscription";
import { MatDialogRef, MatDialog } from "@angular/material";
import { StatusService } from '../../core/services/user/status.service';
import { Observable } from 'rxjs/Rx';

import { RadiologyService, RadiologyRequests } from './../../core/services/radiology/radiology.service';

@Component({
    selector: 'new-radiology-requests',
    moduleId: module.id,
    templateUrl: 'newRequests.component.html',
    styleUrls: ['newRequests.component.css']
})
export class RadiologyNewRequestsComponent implements OnInit {

    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' }
    request: RadiologyRequests[];
    accepted;
    visibilityLoginSpinner;
    visibilitysessionmessage;
    deferedrequestid;
    callDefereid = '5';
    requestrefresh;
    requestrefreshsubscribe: ISubscription;
    patientInfo: PatientInfo;

    connectedSessions;

    currentVirtualSessions: boolean = false;
    sessionHistory: boolean = false;
    msgDefer: boolean = false;


    constructor(private _radiologyService: RadiologyService, private _statusService: StatusService, private dialog: MatDialog, private _messageService: MessageService, private _uiServices: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _countBubble: CountBubble, private _patientinfoservice: PatientInfoService) {

    }

    sectionDataReceived(data) {

    }

    chatBtn(Sid) {

    }


    getRequests() {


        this.visibilityLoginSpinner = 'block';
        this.visibilitysessionmessage = 'none';
        this._radiologyService.getRadiologyRequests().subscribe(
            (response) => {

                if (response.status == 200) {
                    if (JSON.parse(response._body).length != 0) {

                        this.request = JSON.parse(response._body);
                        // this.request.reverse();

                        //   this._countBubble.setsessioncount(this.request.length);

                    } else {
                        this.request = null;
                        this.visibilitysessionmessage = 'block'
                        //   this._countBubble.setsessioncount(0);
                    }
                    this.visibilityLoginSpinner = 'none';
                }

            },
            (error) => {

                this.visibilityLoginSpinner = 'none';
            }
        );
    }

    getRequestswithoutspiner() {
        this._radiologyService.getRadiologyRequests().subscribe(
            (response) => {

                if (response.status == 200) {
                    if (JSON.parse(response._body).length != 0) {

                        this.visibilitysessionmessage = 'none';
                        this.request = JSON.parse(response._body);
                        // this.request.reverse();

                        //this._countBubble.setsessioncount(this.request.length);

                    } else {

                        this.request = null;
                        this.visibilitysessionmessage = 'block'
                        // this._countBubble.setsessioncount(0);
                    }
                    // this.visibilityLoginSpinner='none';
                }

            },
            (error) => {

                // this.visibilityLoginSpinner='none';
            }
        );
    }
    // setRequests(id, action, result) {
    //     this.visibilityLoginSpinner = 'block';
    //     this.visibilitysessionmessage = 'none';
    //     // this.request = null;

    //     if (action == "Reconnect") {
    //         this._specialistRequestService.getSpecialistSessionInfo(id).subscribe(
    //             (response) => {
    //                 if (response.status == 200) {
    //                     if (response._body) {

    //                         let body = JSON.parse(response._body);
    //                         this.accepted = JSON.parse(response._body);
    //                         sessionStorage.setItem('vidyo', JSON.stringify(this.accepted));
    //                         if (result == 'Kart') {
    //                             this._router.navigate(['/call/session']);
    //                         } else {
    //                             this._router.navigate(['/call/endpoint']);
    //                             sessionStorage.setItem('endpointFacilityName', body.facilityName);
    //                             sessionStorage.setItem('endpointSerialNumber', body.serialNumber);

    //                         }

    //                     }
    //                 }
    //                 this.getRequests();
    //             },
    //             (error) => {
    //                 this.getRequests();
    //                 document.getElementById('call-connecting').style.display = 'none';
    //                 let msg = new Message();
    //                 msg.msg = "Something went wrong, please try again.";
    //                 this._uiServices.showToast(msg);
    //                 this.visibilityLoginSpinner = 'none';
    //             }
    //         );
    //     } else {
    //         this._specialistRequestService.setSpecialistRequest(id, action, result).subscribe(
    //             (response) => {
    //                 if (response.status == 200 && action == "Accepted") {
    //                     if (response._body) {

    //                         this.accepted = JSON.parse(response._body);
    //                         sessionStorage.setItem('vidyo', JSON.stringify(this.accepted));
    //                         this._router.navigate(['/call/session']);

    //                     }
    //                 }
    //                 this.getRequests();
    //             },
    //             (error) => {
    //                 this.getRequests();
    //                 document.getElementById('call-connecting').style.display = 'none';
    //                 let msg = new Message();
    //                 msg.msg = "Something went wrong, please try again.";
    //                 this._uiServices.showToast(msg);
    //                 this.visibilityLoginSpinner = 'none';
    //             }
    //         );
    //     }
    // }
    callAccept(req: RadiologyRequests) {
        this._radiologyService.setRadiologyAction(req.referenceId, 'Accepted').subscribe(
            (response) => {

                if (response.status == 200) {
                    let type = req.type == '' ? 'undefined' : req.type;
                    this._router.navigate(['/radiology/session/' + req.specialityId + '/' + req.referenceId + '/' + type]);
                }

            },
            (error) => {

            }
        );
    }

    callReconnect(id, connectionFrom, facilityName, reasonForRequest, specialityName, endPoint, endPointId) {

        document.getElementById('call-connecting').style.display = 'block';
        this._patientinfoservice.isrefreshed = true;

        sessionStorage.setItem('facilityName', facilityName);
        sessionStorage.setItem('specialityName', specialityName);
        sessionStorage.setItem('reasonForRequest', reasonForRequest);
        sessionStorage.setItem('endPoint', endPoint);
        sessionStorage.setItem('endPointId', endPointId);
        //this.setRequests(id, 'Reconnect', connectionFrom);

    }

    callDefere(id) {
        //this.request=[];
        let msg = new Message();
        msg.msg = id;
        msg.title = "";
        msg.okBtnTitle = "Defer";
        msg.onOkBtnClick = this.yesClick.bind(this);
        msg.showInput = "block";
        this._uiServices.showMsgBox(msg);



    }
    yesClick(result, id) {
        // this.setRequests(id,'Defered')
        //this.setRequests(id, 'Deferred', result)
    }
    callReject(id) {

        // this.setRequests(id, 'Rejected', '')
        //  this.setRequests(id,'Rejected')
    }

    callEnd(id) {
        //  this.setRequests(id, 'EndSession', '')
    }

    callanimate() {
        setTimeout(() => {
            document.getElementById("connecting1").style.visibility = 'visible';
            document.getElementById("connecting2").style.visibility = 'hidden';
            document.getElementById("connecting3").style.visibility = 'hidden';
        }, 0);

        setTimeout(() => {
            document.getElementById("connecting1").style.visibility = 'hidden';
            document.getElementById("connecting2").style.visibility = 'visible';
            document.getElementById("connecting3").style.visibility = 'hidden';
        }, 3500);

        setTimeout(() => {
            document.getElementById("connecting1").style.visibility = 'hidden';
            document.getElementById("connecting2").style.visibility = 'hidden';
            document.getElementById("connecting3").style.visibility = 'visible';
        }, 7000);

        // setTimeout(()=> {
        //     document.getElementById("connecting1").style.visibility='hidden'; 
        //     document.getElementById("connecting2").style.visibility='hidden'; 
        //     document.getElementById("connecting3").style.visibility='hidden'; 
        // }, 10500);
    }
    ngOnInit(): void {

        this._statusService.getpermissionCodes().subscribe(res => {
            if (res) {
                this.currentVirtualSessions = res.CurrentVirtualSessions
                this.sessionHistory = res.SessionHistory
            }
        });

        this._statusService.getpermissionCodesParent().subscribe(res => {
            if (res) {
                this.msgDefer = res.Messages
            }
        });

        sessionStorage.removeItem('vidyo');
        sessionStorage.removeItem('reasonForRequest');
        sessionStorage.removeItem('facilityName');

        this.getRequests();
        this.requestrefresh = Observable.interval(15000);
        this.requestrefreshsubscribe = this.requestrefresh.subscribe(ex => {
            this.getRequestswithoutspiner();
        });


        let user = this._authServices.getUser();
        if (!user) {
            return;
        }



    }
    ngOnDestroy() {
        this.dialog.closeAll();
        this.requestrefreshsubscribe.unsubscribe();
    }

}




