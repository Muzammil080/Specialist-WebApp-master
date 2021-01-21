import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AppointmentService } from "../../core/services/appointment/appointment.services";
import { MatDialogRef } from "@angular/material";
import { Validators, FormControl, FormGroup } from "@angular/forms";
import { UIService } from "../../core/services/ui/ui.service";
import { Message } from "../../core/models/message";
import { UtilityService } from "../../core/services/general/utility.service";

@Component({
    selector: "app-quick-appointment",
    templateUrl: "./quick-appointment.component.html",
    styleUrls: ["./quick-appointment.component.css"],
})
export class QuickAppointmentComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<QuickAppointmentComponent>,
        private appointmentService: AppointmentService,
        private uiService: UIService,
        private utilService: UtilityService
    ) {}

    appointment;
    timezones = [{name: 'Pacific Time' , strValue: 'PT' , offset : -25200},
                {name: 'Central Time' , strValue: 'CT' , offset : '-18000'},
                {name: 'Eastern Time' , strValue: 'ET' , offset : -14400},
                {name:'Mountain Time' , strValue :'MST' , offset : -21600},
                {name:'Local Time' , strValue: Intl.DateTimeFormat().resolvedOptions().timeZone , offset : -(new Date().getTimezoneOffset() * 60)}];
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
    patternName = /^[A-Za-z\u00C0-\u00ff]+((-| |'|\.)( )*[A-Za-z\u00C0-\u00ff]+(-| |'|\.)*( )*)*$/;
    emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    telInputObjectPatientPhoneNo;
    @ViewChild("submitButton", { read: ElementRef }) submitButton: ElementRef;
    patientInfoForm = new FormGroup({
        firstName: new FormControl("", [
            Validators.required,
            Validators.pattern(this.patternName),
            Validators.maxLength(64),
        ]),
        lastName: new FormControl("", [
            Validators.required,
            Validators.pattern(this.patternName),
            Validators.maxLength(64),
        ]),
        email: new FormControl("", [
            Validators.pattern(this.emailPattern),
            Validators.maxLength(128),
        ]),
        // ssn: new FormControl("", []),
        phoneNumber: new FormControl("", [
            Validators.pattern(this.phonePattern),
            Validators.required,
        ]),
        timezone: new FormControl(this.timezones.find(x=>x.name == 'Local Time').strValue, [
            Validators.required,
        ]),
        timezoneOffset: new FormControl(this.timezones.find(x=>x.name == 'Local Time').offset, [
            Validators.required,
        ]),
        reason: new FormControl('', [
            Validators.required,
            Validators.maxLength(255)
        ]),
    });

    ngOnInit() {

    }
    getFormvalues() {
        this.appointment = {};
        this.appointment.patientFirstName = this.utilService.TrimExtraSpaces(
            this.patientInfoForm.controls.firstName.value
        );
        this.appointment.patientLastName = this.utilService.TrimExtraSpaces(
            this.patientInfoForm.controls.lastName.value
        );
        this.appointment.patientEmail = this.utilService.TrimExtraSpaces(
            this.patientInfoForm.controls.email.value
        );
        this.appointment.patientMobileNumber = this.utilService.TrimExtraSpaces(
            this.telInputObjectPatientPhoneNo.getNumber()
        );
        this.appointment.patientTimeOffset = this.patientInfoForm.controls.timezoneOffset.value;
        this.appointment.patientTimeZone = this.patientInfoForm.controls.timezone.value;
        this.appointment.reason = this.utilService.TrimExtraSpaces(this.patientInfoForm.controls.reason.value);
        this.appointment.type = "quick";
    }

    createQuickAppointment() {

        if (this.patientInfoForm.invalid) {
            for (let i in this.patientInfoForm.controls) {
                this.patientInfoForm.controls[i].markAsTouched();
                //this.patientInfoForm.markAllAsTouched();
            }
            return false;
        }

        this.submitButton.nativeElement.disabled = true;

        this.getFormvalues();
        console.log(this.appointment);
        this.appointmentService.saveAppointment(this.appointment).subscribe(
            (response) => {
                const success = new Message();
                success.msg = "Appointment Successfully Created";
                success.type = "success";
                success.iconType = "done";
                this.uiService.showToast(success);
                this.patientInfoForm.reset();
                this.dialogRef.close(true);
            },
            (err) => {
                this.submitButton.nativeElement.disabled = false;
                if(err.status !== 0){
                const message = new Message();
                console.log(err, "error returned appt");
                message.type = "danger";
                message.iconType = "error";
                if (err.status === 401) {
                    message.msg = "Login session expired";
                }else{
                    message.msg = err._body;
                }
                this.uiService.showToast(message);
                }
            }
        );
    }

    onCountryChange(ev) {
        console.log(ev, "country change");
    }
    telInputPhoneNo(ev) {
        this.telInputObjectPatientPhoneNo = ev;
        console.log(ev, "telinput");
    }
    getNumber(ev) {
        console.log(ev, 'number');
    }

    onTimezoneChanged(ev){
        this.patientInfoForm.controls.timezoneOffset
        .setValue(this.timezones.find(x=>x.strValue == ev.value).offset);
    }
}
