import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InviteService } from "../../../core/services/invites/invite.service";
import { MAT_DIALOG_DATA } from "@angular/material";
import { Message } from "../../../core/models/message";
import { UIService } from "../../../core/services/ui/ui.service";

@Component({
    selector: "app-external-specialist",
    templateUrl: "./external-specialist.component.html",
    styleUrls: ["./external-specialist.component.css"],
})
export class ExternalSpecialistComponent implements OnInit {
    constructor(private inviteService:InviteService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _uiService:UIService) {}

    ngOnInit() {}

    isLoading:boolean = false;
    telInputObjectPhoneNo;
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public mask = [
        "(",
        /[1-9]/,
        /\d/,
        /\d/,
        ")",
        " ",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
    ];
    phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    patternName = /^[A-Za-z\u00C0-\u00ff]+((-| |'|\.)( )*[A-Za-z\u00C0-\u00ff]+(-| |'|\.)*( )*)*$/;




    externalSpecForm = new FormGroup({
        name: new FormControl("", [
            Validators.required,
            Validators.pattern(this.patternName),
            Validators.maxLength(32),
        ]),
        email: new FormControl("", [
            Validators.required,
            Validators.pattern(this.emailPattern),
            Validators.maxLength(32),
        ]),
        phoneNumber: new FormControl("", [
            Validators.required,
            Validators.pattern(this.phonePattern),
        ]),
    });

    inviteExternalSpecialist() {
        this.isLoading = true;
        const data: any = {};
        data.participantName = this.externalSpecForm.controls.name.value;
        data.participantEmail = this.externalSpecForm.controls.email.value;
        data.participantNumber =  this.telInputObjectPhoneNo.getNumber();
        data.inviteType = {};
        data.inviteType.type = "ExternalSpecialist";
        if(sessionStorage.getItem('appointmentId')){
            const appointmentId = JSON.parse(
                sessionStorage.getItem('appointmentId')
            );
            data.sessionType = 'appointment';
            data.specialistRequestId = appointmentId;
        }else{
            data.sessionType = 'inpatient';
            data.specialistRequestId = this.data.specialistRequestId;
        }
        this.inviteService.sendInvite(data).subscribe(
            (res) => {
                this.isLoading = false;
                const msg = new Message();
                msg.msg = 'Invite sent';
                msg.type = 'success';
                msg.iconType = 'check_circle';
                this._uiService.showToast(msg);
                this.externalSpecForm.reset();
            },
            (err) => {
                this.isLoading = false;
                const msg = new Message();
                msg.msg = err._body;
                msg.type = 'error';
                msg.iconType = 'check_circle';
                this._uiService.showToast(msg);
            }
        );
    }

    onCountryChange(ev) {
        console.log(ev, "country change");
    }
    telInputPhoneNo(ev) {
        this.telInputObjectPhoneNo = ev;
        console.log(ev, "telinput");
    }
    getNumber(ev) {
        console.log(ev, 'number');
    }
}
