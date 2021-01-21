import { Component, Inject } from '@angular/core';
import { PatientInfoService } from '../../core/services/specialist/patientinfo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'ViewPacs-Dialog',

    templateUrl: 'viewPacsDialog.component.html',
    styleUrls: ['../home.component.css']
})
export class ViewPacsDialogComponent {
    _attempt: number = 0;
    _attemptTimeout;
    viewPacsDisabled: boolean = true;
    showError: boolean = false;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ViewPacsDialogComponent>,
        private _patientinfoservice: PatientInfoService,
        private _router: Router
    ) {}

    ngOnInit() {
        this.checkPacsAvailability();
    }

    checkPacsAvailability() {
        console.error('checkPacsAvailability');
        this._attempt++;
        console.log('Attempt # ' + this._attempt);
        this._patientinfoservice.checkpatinentpacsinfo(this.data.mrn).subscribe(
            response => {
                if (response.status == 200) {
                    this.viewPacsDisabled = false;
                }
            },
            error => {
                if (this._attempt <= 5) {
                    this._attemptTimeout = setTimeout(() => {
                        this.checkPacsAvailability();
                    }, 10000);
                } else {
                    this.showError = true;
                }
            }
        );
    }

    ngOnDestroy(): void {
        clearTimeout(this._attemptTimeout);
    }
}
