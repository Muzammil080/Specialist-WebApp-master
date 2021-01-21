import { Component, OnInit } from '@angular/core';
import { OpdService } from '../../core/services/opd/opd.service';
import { UtilityService } from '../../core/services/general/utility.service';
import { MappingService } from '../../core/services/mapping/mapping.service';
import { Appointment } from '../../core/models/appointment';
import { StatusService } from '../../core/services/user/status.service';
import { addMinutes } from 'date-fns';

@Component({
    selector: 'my-appointments',
    templateUrl: './my-appointments.component.html',
    styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements OnInit {
    inputValue;
    startDate: Date;
    endDate: Date;
    patientLastName = '';
    patientFirstName = '';
    appointments: Appointment[] = [];
    appointmentsCount = 0;
    currentpage = 1;
    PageLength: number;
    PageLengthrange: number[];
    pageSize = 5;
    pageIndex = 0;
    paginationdisplaybtn;
    paginationdisplay = 'none';
    visibilityLoginSpinner;
    visibilityLoginSpinnerdata;
    zeroResults;
    timezoneoffset;
    pageSizeOptions = [5, 10, 50, 100];
    loading = false;


    constructor(
        public _opdService: OpdService,
        public _utilityService: UtilityService,
        public _mappingService: MappingService,
        public _statusService: StatusService
    ) { }

    ngOnInit() {
        this.getTimezone();
        this.getAppointments();
    }

    getTimezone() {
        const d = new Date();
        this._statusService.getUserInfo().subscribe(
            response => {
                const getUser = this._mappingService.mapUser(response);
                if (getUser != null) {
                    this.timezoneoffset = getUser.utcDSTOffset / 60;
                    // this.timeZone = getUser.stateName;
                }
            },
            error => { }
        );
    }

    getAppointments() {
        this.loading = true;
        this.appointments = [];
        if(this.startDate){
            this.startDate.setHours(0,0,0);
        }
        if(this.endDate){
            this.endDate.setHours(23,59,59);
        }
        console.log(this.startDate,this.endDate,"dates");
        this.visibilityLoginSpinner = 'table-cell';
        this.visibilityLoginSpinnerdata = 'none';
        const data = {
            to: this.endDate ? this.endDate.toUTCString() : null,
            from: this.startDate ? this.startDate.toUTCString() : null,
            mrn: null,
            patientLastName: this.patientLastName,
            patientFirstName: this.patientFirstName,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            isFilterOn: false
        };

        if (
            this.patientFirstName ||
            this.patientLastName ||
            (this.endDate && this.startDate)
        ) {
            data.isFilterOn = true;
            // if (this.endDate) {
            //     data.to = addMinutes(this.endDate, this.timezoneoffset * -1).toString().split('GMT')[0];
            // }
            // if (this.startDate) {
            //     data.from = addMinutes(this.startDate, this.timezoneoffset * -1).toString().split('GMT')[0];
            // }
        }

        this._opdService.getMyAppointmentsCount(data).subscribe(
            response => {
                this.visibilityLoginSpinner = 'none';
                this.visibilityLoginSpinnerdata = 'table-row';
                if (response.status === 200) {
                    if (response.json() != null) {
                        this.appointmentsCount = response.json();

                        if (this.appointmentsCount === 0) {
                            this.loading = false;
                            this.zeroResults = 'table-cell';
                        } else {
                            this.zeroResults = 'none';

                            this._opdService
                                .getMyAppointments(data)
                                .subscribe(res => {
                                    this.loading = false;
                                    if (res.status === 200) {
                                        const resp = res.json();
                                        resp.forEach(element => {
                                            this.appointments.push(
                                                this._mappingService.mapAppointment(
                                                    element
                                                )
                                            );
                                        });
                                        // this.appointments = res.json();
                                    }
                                });
                        }
                    }
                }
            },
            error => {
                this.visibilityLoginSpinner = 'none';
                this.visibilityLoginSpinnerdata = 'table-row';
                this.loading = false;
            }
        );
    }

    filter() {
        this.pageIndex = 0;
        this.getAppointments();
    }

    onStartDateFocusOut() {
        if (this.startDate && this.endDate) {
            if (
                this._utilityService.dateDifferenceInDays(
                    this.startDate,
                    this.endDate
                ) < 0
            ) {
                this.endDate = null;
            } else {
                this.pageIndex = 0;
                this.getAppointments();
            }
        }
    }
    onEndDateFocusOut() {
        if (this.startDate && this.endDate) {
            if (
                this._utilityService.dateDifferenceInDays(
                    this.startDate,
                    this.endDate
                ) < 0
            ) {
                this.endDate = null;
            } else {
                this.pageIndex = 0;
                this.getAppointments();
            }
        }
    }

    pageChanged(event) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getAppointments();
    }
    reset(){
        this.startDate = null;
        this.endDate = null;
        this.filter();
    }
}
