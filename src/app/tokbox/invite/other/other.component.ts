import { Component, OnInit, Inject, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { InviteService } from "../../../core/services/invites/invite.service";
import { MAT_DIALOG_DATA } from "@angular/material";
import { UIService } from "../../../core/services/ui/ui.service";
import { Message } from "../../../core/models/message";

@Component({
    selector: "app-other",
    templateUrl: "./other.component.html",
    styleUrls: ["./other.component.css"],
})
export class OtherComponent implements OnInit {
    constructor(private inviteService: InviteService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _uiService:UIService) {}


    ngOnInit() {
        this.getRelations();
    }
    @ViewChild('rBtn') rBtn: ElementRef;
    isLoading:boolean = false;
    relations;
    relationName;
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

    otherForm = new FormGroup({
        name: new FormControl("", [
            Validators.required,
            Validators.pattern(this.patternName),
            Validators.maxLength(32),
        ]),
        email: new FormControl("", [
            Validators.pattern(this.emailPattern),
            Validators.maxLength(32),
        ]),
        phoneNumber: new FormControl("", [
            Validators.required,
            Validators.pattern(this.phonePattern),
        ]),
        relation: new FormControl("Family Member", [Validators.required]),
    });
    inviteOther() {
        this.isLoading = true;
        const data: any = {};
        data.participantName = this.otherForm.controls.name.value;
        data.participantEmail = this.otherForm.controls.email.value;
        data.participantNumber =  this.telInputObjectPhoneNo.getNumber();
        data.inviteType = {};
        if(this.otherForm.controls.relation.value.toLowerCase() == 'external care provider'){
            data.inviteType.type = "ExternalSpecialist";
        }else{
            data.inviteType.type = "Other";
        }
        data.participantRelation = this.otherForm.controls.relation.value;



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
                this.otherForm.reset();
                this.rBtn.nativeElement.click();
            },
            (err) => {
                this.isLoading = false;
                if(err.status !== 0){

                    const msg = new Message();
                    msg.msg = err._body;
                    msg.type = 'error';
                    msg.iconType = 'check_circle';
                    this._uiService.showToast(msg);
                }

            }
        );
    }

    getRelations() {
        this.isLoading = true;
        this.inviteService.GetRelations().subscribe((res) => {
            this.relations = JSON.parse(res._body);
            console.log(this.relations, "relations");
            this.isLoading = false;
        });
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
