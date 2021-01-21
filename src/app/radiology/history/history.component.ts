import { Component, OnInit, Inject, ViewChild } from '@angular/core'

import { Message } from "../../core/models/message";
import { AuthService } from '../../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { CountBubble } from './../../core/services/specialist/countbubble.service';
import { SpecialistRequestService } from './../../core/services/specialist/specialistrequests.service';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SignalRService } from './../../core/services/signalr/signalr.service';
import { RadiologyService, RadiologyRequests } from './../../core/services/radiology/radiology.service';
import { UIService } from "../../core/services/ui/ui.service";
@Component({
    selector: 'radiology-history',
    moduleId: module.id,
    templateUrl: 'history.component.html',
    styleUrls: ['history.component.css']
})
export class RadiologyHistoryComponent implements OnInit {

    LastW;
    LastM = true;
    LastY;
    SessionHistory: RadiologyRequests[] = [];
    SessionHistoryFilter: RadiologyRequests[];
    SessionHistoryFilterPagination: RadiologyRequests[] = [];
    PageLength: number;
    PageLengthrange: number[]
    paginationdisplaybtn;
    paginationdisplay = "none";
    paginationdisplayfilter = "none";
    currentpage = 1;
    zeroResults = "none";
    inputValue = null;
    visibilityLoginSpinner;
    visibilityLoginSpinnerdata;

    constructor(private _radiologyService: RadiologyService, private _signalRService: SignalRService, private _specialistRequestService: SpecialistRequestService, private _uiServices: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _countBubble: CountBubble) {

    }


    resendNote(req: RadiologyRequests) {

        this._radiologyService.signRadiologyNotes(req.referenceId).subscribe(
            (response) => {

                if (response.status == 200) {

                    let msg = new Message();
                    msg.msg = "Reports resend successfully"
                    msg.type = 'success';
                    msg.iconType = 'check_circle';
                    this._uiServices.showToast(msg);
                }

            },
            (error) => {
                console.error(error)

                let msg = new Message();
                msg.msg = "Failed to sign reports"
                msg.type = 'error';
                msg.iconType = 'check_circle';
                this._uiServices.showToast(msg);
            }
        );
    }

    openReports(req: RadiologyRequests) {
        let type = req.type == '' ? 'undefined' : req.type;

        this._router.navigate(['/radiology/session/' + req.specialityId + '/' + req.referenceId + '/' + type ]);

    }

    openReportsWithoutPacs(req: RadiologyRequests) {
        let type = req.type == '' ? 'undefined' : req.type;

        this._router.navigate(['/radiology/session/' + req.specialityId + '/' + req.referenceId + '/' + 1 + '/' + type]);

    }

    sessionfilter(val: string) {

        this.currentpage = 1;
        this.SessionHistoryFilter = this.SessionHistory.filter(function (hero, index) {

            let requestDateTime = hero.requestDateTime.split('.');
            let acceptedOn = hero.requestDateTime.split('.');
            let signedOn = hero.requestDateTime.split('.');

            let requestDateTimeLocalTimeZone = new DatePipe("en-US").transform(requestDateTime[0] + '.000Z', 'MMM d y h:mm a')
            let acceptedOnLocalTimeZone = new DatePipe("en-US").transform(requestDateTime[0] + '.000Z', 'MMM d y h:mm a')
            let signedOnLocalTimeZone = new DatePipe("en-US").transform(requestDateTime[0] + '.000Z', 'MMM d y h:mm a')

            if (
                (hero.referenceId && hero.referenceId.toString().toUpperCase().indexOf(val.trim().toUpperCase()) > -1) ||
                hero.submittedBy.toUpperCase().indexOf(val.trim().toUpperCase()) > -1 ||
                hero.mrn.toUpperCase().indexOf(val.trim().toUpperCase()) > -1 ||
                requestDateTimeLocalTimeZone.toUpperCase().indexOf(val.trim().toUpperCase()) > -1 ||
                acceptedOnLocalTimeZone.toUpperCase().indexOf(val.trim().toUpperCase()) > -1 ||
                signedOnLocalTimeZone.toUpperCase().indexOf(val.trim().toUpperCase()) > -1

            ) {
                return hero.referenceId;

            }


        });

        if (val.trim()) {
            if (this.SessionHistoryFilter.length <= 8) {
                // this.paginationdisplay ="block";
                this.paginationdisplaybtn = "none"
                this.paginationdisplayfilter = "none"
            } else {
                this.paginationdisplaybtn = "block"
                this.paginationdisplayfilter = "block"
            }

            this.paginationdisplay = "none";
            //  this.paginationdisplayfilter="block"

            this.SessionHistoryFilterPagination = this.SessionHistoryFilter
            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(0, 8);
            this.PageLength = Math.ceil(this.SessionHistoryFilterPagination.length / 8);
            this.PageLengthrange = this.createRange(this.PageLength)

        } else {
            if (this.SessionHistory.length <= 8) {
                // this.paginationdisplay ="block";
                this.paginationdisplaybtn = "none"
                this.paginationdisplay = "none";
            } else {
                this.paginationdisplaybtn = "block"
                this.paginationdisplay = "block";
            }

            // this.paginationdisplay="block";
            this.paginationdisplayfilter = "none";

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(0, 8);
            this.PageLength = Math.ceil(this.SessionHistory.length / 8);
            this.PageLengthrange = this.createRange(this.PageLength)
        }

        if (this.SessionHistory.length == 0 || this.SessionHistoryFilter.length == 0) {
            this.zeroResults = "table-cell";
        } else {
            this.zeroResults = "none";
        }
    }
    historychangebtn(val) {

        this.currentpage = 1;

        this.inputValue = null;

        // this.sessionfilter(' ');
        this.zeroResults = "none";
        this.paginationdisplay = "none";
        this.paginationdisplayfilter = "none";
        this.paginationdisplaybtn = "none";
        if (val == 'W') {
            this.LastW = true;
            this.LastM = false;
            this.LastY = false;
            this.getHistory(7);
        } else if (val == 'M') {
            this.LastW = false;
            this.LastM = true;
            this.LastY = false;
            this.getHistory(31);
        } else if (val == 'Y') {
            this.LastW = false;
            this.LastM = false;
            this.LastY = true;
            this.getHistory(366);
        }

    }

    getHistory(range) {

        this.SessionHistory = []


        this.visibilityLoginSpinner = "table-cell";
        this.visibilityLoginSpinnerdata = "none"
        let date = new Date()

        this._radiologyService.getRadiologyHistory(date.getFullYear(), date.getMonth() + 1, date.getDate(), range).subscribe(
            (response) => {
                this.visibilityLoginSpinner = "none";
                this.visibilityLoginSpinnerdata = "table-row"
                if (response.status == 200) {
                    if (JSON.parse(response._body) != null) {

                        this.SessionHistory = JSON.parse(response._body);
                        this.SessionHistoryFilter = this.SessionHistory;
                        this.SessionHistoryFilter = this.SessionHistoryFilter.slice(0, 8);
                        this.PageLength = Math.ceil(this.SessionHistory.length / 8);
                        this.PageLengthrange = this.createRange(this.PageLength)

                        if (this.SessionHistory.length <= 8) {
                            // this.paginationdisplay ="block";
                            this.paginationdisplaybtn = "none"
                            this.paginationdisplay = "none"
                        } else {
                            this.paginationdisplaybtn = "block"
                            this.paginationdisplay = "block"
                        }


                        if (this.SessionHistory.length == 0) {
                            this.zeroResults = "table-cell";
                        } else {
                            this.zeroResults = "none";
                        }
                    }

                }

            },
            (error) => {
                this.visibilityLoginSpinner = "none";
                this.visibilityLoginSpinnerdata = "table-row";
            }
        );


    }

    pagNum(val, filter) {
        // this.firstime =false;

        if (!filter.trim()) {
            this.SessionHistoryFilter = this.SessionHistory;
        } else {
            this.SessionHistoryFilter = this.SessionHistoryFilterPagination
        }


        // this.endpointfilter(filter)
        if (val != 'P' && val != 'N') {

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(((val * 8) - 8), (val * 8));
            this.currentpage = val;

            // if (val == 1) {
            //     this.firstime =true;
            // }
            //   this.firstime = val;

        } else if (val == 'P') {

            if (this.currentpage != 1) {
                val = this.currentpage - 1;
                this.currentpage = val;
            } else {
                val = this.currentpage;
                this.currentpage = val;
            }

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(((val * 8) - 8), (val * 8));
        } else if (val == 'N') {

            if (this.currentpage < this.PageLength) {
                val = this.currentpage + 1;
                this.currentpage = val;
            } else {
                val = this.currentpage;
                this.currentpage = val;

            }

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(((val * 8) - 8), (val * 8));
        }



    }


    ngOnInit(): void {



        this.getHistory(31);


    }

    createRange(number) {
        var items: number[] = [];
        for (var i = 1; i <= number; i++) {
            items.push(i);
        }
        return items;
    }
}

export class SessionHistory {

    id: string;
    mrn: any;
    encounterNumber: any;
    endPointName: any;
    // specialityId: any;
    // specialityName: any;
    // facilityId: any;
    facilityName: any;
    // status: any;
    // pendingSince: any;
    // isHighPriority: any;
    // reasonForRequest: any;
    durationInMinutes: any;
    partnerSite: any;
    endPoint: any;
    receivedOn: any;

}


