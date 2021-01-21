import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { MatDialog, MatOptionSelectionChange } from '@angular/material';
import { AppointmentHistoryServices, Appointment } from '../../core/services/appointment/appointment-history.services';
import { PartnersiteService } from '../../core/services/partnersite/partnersite.services';
@Component({
    selector: 'appointment-history',
    templateUrl: './appointment-history.component.html',
    styleUrls: ['./appointment-history.component.css']
})
export class AppointmentHistoryComponent implements OnInit {

    name: string = null;
    appointments: Appointment;
    sessionsCount: number;

    loading = true;
    isError = false;
    pageload = true;

    pageSize = 5;
    pageIndex = 0;

    pageSizeOptions = [5, 10, 50, 100];

    LastW;
    LastM;
    LastY;

    numberofdays;
    sessionserach = '';
    appointmentSearch = '';
    partnersite = [];
    facilities = [];
    date = new Date();

    constructor(
        private _historyService: AppointmentHistoryServices,
        private _partnersiteService: PartnersiteService,
        private _router: Router
        ) { }

    ngOnInit() {
        this.callPartnersites();
        this.callFacilities(0);
        this.LastW = true;
        this.getHistory(7);
    }
    pageChanged(event) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.refresh();
    }

    getHistory(numberofdays) {
        this.numberofdays = numberofdays;
            this.getAppointmentHistory(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
            this.getHistoryCount(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
    }
    refresh() {
            this.getAppointmentHistory(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
            this.getHistoryCount(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
    }
    ngAfterViewInit() {
        setTimeout(() => {this.pageload = false;}, 1000);
    }
    dsisableAll() {
        this.LastW = false;
        this.LastM = false;
        this.LastY = false;
    }
    historyChangeButton(val) {
        this.pageIndex = 0;
        if (val === 'W') {
            this.dsisableAll();
            this.LastW = true;
            this.getHistory(7);
        } else if (val === 'M') {
            this.dsisableAll();
            this.LastM = true;
            this.getHistory(31);
        } else if (val === 'Y') {
            this.dsisableAll();
            this.LastY = true;
            this.getHistory(366);
        }
    }
    getAppointmentHistory(year, month, day, numberofdays, pageIndex, pageSize, filter) {
        this.loading = true;
        this.appointments = null;

        if (filter != '') {
            this._historyService.getAppointmentFilterHistory(year, month, day, numberofdays, filter, pageIndex, pageSize).subscribe(
                responseData => {
                    this.appointments = JSON.parse(responseData._body);
                    console.log("Appointmnet Filtered History  : ", this.appointments);
                    this.loading = false;
                    this.isError = false;
                },
                err => {
                    this.isError = true;
                    this.loading = false;
                }
            );
        } else {
            this._historyService.getApppointmentHistory(year, month, day, numberofdays, pageIndex, pageSize).subscribe(
                responseData => {
                    this.appointments = JSON.parse(responseData._body);
                    console.log("Appointment History : ", this.appointments);
                    this.loading = false;
                    this.isError = false;
                },
                err => {
                    this.isError = true;
                    this.loading = false;
                });
        }
    }
    getHistoryCount(year, month, day, numberofdays, filter) {
        if (filter != '') {
            this._historyService.getAppointmentFilteredCountHistory(year, month, day, numberofdays, filter).subscribe(
                responseData => {
                    this.sessionsCount = JSON.parse(responseData._body);
                },
                err => { }
            );
        } else {
            this._historyService.getAppointmentCountHistory(year, month, day, numberofdays).subscribe(
                responseData => {
                    this.sessionsCount = JSON.parse(responseData._body);
                },
                err => { }
            );
        }
    }
    callPartnersites() {
        this._partnersiteService.getPartnerSite().subscribe(
            response => {
                this.partnersite = JSON.parse(response._body);
            },
            error => { }
        );
    }
    callFacilities(id) {
        this._partnersiteService.getFacilityByPartnerSiteId(id).subscribe(
            response => {
                this.facilities = JSON.parse(response._body);
            },
            error => { }
        );
    }
    // searchByselect(event: MatOptionSelectionChange, type, id) {
    //     this.pageSize = 5;
    //     this.pageIndex = 0;

    //     if (!this.pageload) {
    //         if (event.source.selected) {
    //             if (type === 'partnersite') {
    //                 this.callFacilities(id);
    //                 this.facilityId = 0;
    //             } else if (type === 'facility') {
    //                 if (id !== 0) {
    //                     this.getAppointmentHistory(0, id, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
    //                     this.getHistoryCount(0, id, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
    //                 } else {
    //                     this.getAppointmentHistory(this.partnersiteId, 0, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
    //                     this.getHistoryCount(this.partnersiteId, 0, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
    //                 }
    //             }
    //         }
    //    }
    //}
    appointmentsfilter() {
            this.getAppointmentHistory(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
            this.getHistoryCount(this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
     }
    //sessionfilterclear() {
    //     this.sessionserach = '';
    //     if (this.facilityId !== 0) {
    //         this.getAppointmentHistory(0, this.facilityId, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
    //         this.getHistoryCount(0, this.facilityId, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
    //     } else {
    //         this.getAppointmentHistory(this.partnersiteId, 0, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.pageIndex, this.pageSize, this.sessionserach);
    //         this.getHistoryCount(this.partnersiteId, 0, this.date.getUTCFullYear(), this.date.getUTCMonth() + 1, this.date.getUTCDate(), this.numberofdays, this.sessionserach);
    //     }
    //}

    openNote(cn) {
        console.log(cn,"in open note");
        // 1 is just to distinguish it from the other route
        this._router.navigate([
            "/notes/" + 1 + '/'+ cn.specialityId+'/' + cn.id + "/" + cn.workflowInstanceId
        ]);
    }
}
