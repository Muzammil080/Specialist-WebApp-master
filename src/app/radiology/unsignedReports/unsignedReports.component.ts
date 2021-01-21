import { Component, OnInit, Inject, OnDestroy } from '@angular/core'

import { Message } from "../../core/models/message";
import { AuthService } from '../../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { PatientInfoService, PatientInfo } from "../../core/services/specialist/patientinfo.service";
import { UIService } from "../../core/services/ui/ui.service";
import { SignalRService } from '../../core/services/signalr/signalr.service';
import { MatDialog, PageEvent } from '@angular/material'

import { ClinicalNotesService } from "../../core/services/clinical-notes/clinical.notes.service";
import { RadiologyService, RadiologyRequests } from './../../core/services/radiology/radiology.service';
import { MsgDialog } from '../../shared/msgbox/msgdialog.component';

@Component({
    selector: 'unsigned-radiology-reports',
    // moduleId : module.id,
    templateUrl: 'unsignedReports.component.html',
    styleUrls: ['unsignedReports.component.css']
})
export class unsignedReportsComponent implements OnInit, OnDestroy {


    dynamicNotesData;
    notes;
    constructor(private _radiologyService: RadiologyService, private _notesService: ClinicalNotesService, public dialog: MatDialog, private _signalRService: SignalRService, private _uiServices: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _patientinfoservice: PatientInfoService, ) {

    }

    ngOnInit(): void {

        this.getUnsignedReports();
    }

    openUnsignedRequest(req: RadiologyRequests) {
        let type = req.type == '' ? 'undefined' : req.type;
        this._router.navigate(['/radiology/session/' + req.specialityId + '/' + req.referenceId + '/' + type]);

    }

    getUnsignedReports() {

        this._radiologyService.getRadiologyUnsigned().subscribe((res) => {
            this.notes = JSON.parse(res._body);

            this.notes.forEach(n => {
                let dateNow = new Date();
                let acceptedOn = new Date(n.acceptedOn);
                let diff = Math.abs(dateNow.getTime() - acceptedOn.getTime());
                let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
                n.daysAccepted = diffDays
            });

            console.log(this.notes);

        }, (err) => {

        });
    }

    sessionRejectConfirmation(req: RadiologyRequests) {

        let title = 'Are you sure ?';
        let message = 'Once you reject this request your notes will be deleted.';


        let ref = this.dialog.open(MsgDialog, {
            width: '400px',
            data: {
                title: title,
                message: message,
            }
        });
        ref.afterClosed().subscribe(result => {
            if (result) {
                this.sessionReject(req);

            }
            else {

            }
        })
    }
    sessionReject(req: RadiologyRequests) {
        this._radiologyService.setRadiologyAction(req.referenceId, 'Rejected').subscribe(
            (response) => {

                if (response.status == 200) {
                    this.getUnsignedReports();
                    let msg = new Message();
                    msg.msg = "Session was successfully rejected"
                    msg.type = 'success';
                    msg.iconType = 'check_circle';
                    this._uiServices.showToast(msg);
                    // this._router.navigate(['/radiology/session']);
                }

            },
            (error) => {
                let msg = new Message();
                msg.msg = "Failed to sign notes"
                msg.type = 'error';
                msg.iconType = 'check_circle';
                this._uiServices.showToast(msg);
            }
        );
    }

    ngOnDestroy() {


    }

}

