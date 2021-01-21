import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { UIService } from '../../core/services/ui/ui.service';
import { Message } from '../../core/models/message';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CountBubble } from './../../core/services/specialist/countbubble.service';
import { SpecialistRequestService } from './../../core/services/specialist/specialistrequests.service';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SignalRService } from './../../core/services/signalr/signalr.service';
import { MsgDialog } from '../../shared/msgbox/msgdialog.component';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'sessionhistory',
    moduleId: module.id,
    templateUrl: 'sessionhistory.component.html',
    styleUrls: ['sessionhistory.component.css']
})
export class SessionHistoryComponent implements OnInit {
    LastW;
    LastM = true;
    LastY;
    SessionHistory: SessionHistory[] = [];
    SessionHistoryFilter: SessionHistory[];
    SessionHistoryFilterPagination: SessionHistory[] = [];
    PageLength: number;
    PageLengthrange: number[];
    paginationdisplaybtn;
    paginationdisplay = 'none';
    paginationdisplayfilter = 'none';
    currentpage = 1;
    zeroResults = 'none';
    inputValue = null;
    visibilityLoginSpinner;
    visibilityLoginSpinnerdata;

    constructor(
        public dialog: MatDialog,
        private _signalRService: SignalRService,
        private _specialistRequestService: SpecialistRequestService,
        private _uiService: UIService,
        private _authServices: AuthService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _countBubble: CountBubble
    ) { }

    resendNote(cn) {

        let ref = this.dialog.open(MsgDialog, {
            width: '300px',
            data: {
                title: 'Confirmation',
                message:
                    'Do you want to resend notes?'
            }
        });
        ref.afterClosed().subscribe(result => {
            if (result) {
                this._signalRService.hubConnection // (string endPointId)
                    .invoke('ResendNotes', cn.id, cn.endPointId)
                    .then(res => {
                        let msg = new Message();
                        msg.msg = 'Notes resend successfully';
                        msg.type = 'success';
                        msg.iconType = 'check_circle';
                        this._uiService.showToast(msg);
                    })
                    .catch(err => {
                        console.error(err);
                        let msg = new Message();
                        msg.msg = 'Failed to resend notes';
                        msg.type = 'error';
                        msg.iconType = 'check_circle';
                        this._uiService.showToast(msg);
                    });
            }
        });

    }
    openNote(cn) {
        this._router.navigate([
            '/notes/' + cn.specialityId + '/' + cn.id + '/' + cn.endPointId
        ]);
    }

    sessionfilter(val: string) {
        this.currentpage = 1;
        this.SessionHistoryFilter = this.SessionHistory.filter(function (
            hero,
            index
        ) {
            var durationM = '"' + hero.durationInMinutes + ' Min"';
            var durationH = '"' + hero.durationInMinutes + ' hours"';

            let x = hero.receivedOn.split('.');

            //  var CDate = new Date(x[0]+'.000Z');
            var receivedOn = new DatePipe('en-US').transform(
                x[0] + '.000Z',
                'MMM d y h:mm a'
            );
            if (
                (hero.id &&
                    hero.id
                        .toString()
                        .toUpperCase()
                        .indexOf(val.trim().toUpperCase()) > -1) ||
                hero.partnerSite
                    .toUpperCase()
                    .indexOf(val.trim().toUpperCase()) > -1 ||
                hero.facilityName
                    .toUpperCase()
                    .indexOf(val.trim().toUpperCase()) > -1 ||
                (hero.mrn &&
                    hero.mrn.toUpperCase().indexOf(val.trim().toUpperCase()) >
                    -1) ||
                (hero.encounterNumber &&
                    hero.encounterNumber
                        .toUpperCase()
                        .indexOf(val.trim().toUpperCase()) > -1) ||
                (hero.endPointName &&
                    hero.endPointName
                        .toUpperCase()
                        .indexOf(val.trim().toUpperCase()) > -1) ||
                durationM.toUpperCase().indexOf(val.trim().toUpperCase()) >
                -1 ||
                durationH.toUpperCase().indexOf(val.trim().toUpperCase()) >
                -1 ||
                receivedOn.toUpperCase().indexOf(val.trim().toUpperCase()) > -1
            ) {
                return hero.partnerSite;
            }
        });

        if (val.trim()) {
            if (this.SessionHistoryFilter.length <= 8) {
                // this.paginationdisplay ="block";
                this.paginationdisplaybtn = 'none';
                this.paginationdisplayfilter = 'none';
            } else {
                this.paginationdisplaybtn = 'block';
                this.paginationdisplayfilter = 'block';
            }

            this.paginationdisplay = 'none';
            //  this.paginationdisplayfilter="block"

            this.SessionHistoryFilterPagination = this.SessionHistoryFilter;
            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(0, 8);
            this.PageLength = Math.ceil(
                this.SessionHistoryFilterPagination.length / 8
            );
            this.PageLengthrange = this.createRange(this.PageLength);
        } else {
            if (this.SessionHistory.length <= 8) {
                // this.paginationdisplay ="block";
                this.paginationdisplaybtn = 'none';
                this.paginationdisplay = 'none';
            } else {
                this.paginationdisplaybtn = 'block';
                this.paginationdisplay = 'block';
            }

            // this.paginationdisplay="block";
            this.paginationdisplayfilter = 'none';

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(0, 8);
            this.PageLength = Math.ceil(this.SessionHistory.length / 8);
            this.PageLengthrange = this.createRange(this.PageLength);
        }

        if (
            this.SessionHistory.length == 0 ||
            this.SessionHistoryFilter.length == 0
        ) {
            this.zeroResults = 'table-cell';
        } else {
            this.zeroResults = 'none';
        }
    }
    historychangebtn(val) {
        this.currentpage = 1;

        this.inputValue = null;

        this.sessionfilter(' ');
        this.zeroResults = 'none';
        this.paginationdisplay = 'none';
        this.paginationdisplayfilter = 'none';
        this.paginationdisplaybtn = 'none';
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
        this.SessionHistory = [];

        this.visibilityLoginSpinner = 'table-cell';
        this.visibilityLoginSpinnerdata = 'none';
        let date = new Date();

        this._specialistRequestService
            .getSpecialistSessionHistory(
                date.getUTCFullYear(),
                date.getUTCMonth() + 1,
                date.getUTCDate(),
                range
            )
            .subscribe(
                response => {
                    this.visibilityLoginSpinner = 'none';
                    this.visibilityLoginSpinnerdata = 'table-row';
                    if (response.status == 200) {
                        if (JSON.parse(response._body) != null) {
                            this.SessionHistory = JSON.parse(response._body);
                            this.SessionHistoryFilter = this.SessionHistory;
                            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(
                                0,
                                8
                            );
                            this.PageLength = Math.ceil(
                                this.SessionHistory.length / 8
                            );
                            this.PageLengthrange = this.createRange(
                                this.PageLength
                            );

                            if (this.SessionHistory.length <= 8) {
                                // this.paginationdisplay ="block";
                                this.paginationdisplaybtn = 'none';
                                this.paginationdisplay = 'none';
                            } else {
                                this.paginationdisplaybtn = 'block';
                                this.paginationdisplay = 'block';
                            }

                            if (this.SessionHistory.length == 0) {
                                this.zeroResults = 'table-cell';
                            } else {
                                this.zeroResults = 'none';
                            }
                        }
                    }
                },
                error => {
                    this.visibilityLoginSpinner = 'none';
                    this.visibilityLoginSpinnerdata = 'table-row';
                }
            );
    }

    pagNum(val, filter) {
        // this.firstime =false;

        if (!filter.trim()) {
            this.SessionHistoryFilter = this.SessionHistory;
        } else {
            this.SessionHistoryFilter = this.SessionHistoryFilterPagination;
        }

        // this.endpointfilter(filter)
        if (val != 'P' && val != 'N') {
            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(
                val * 8 - 8,
                val * 8
            );
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

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(
                val * 8 - 8,
                val * 8
            );
        } else if (val == 'N') {
            if (this.currentpage < this.PageLength) {
                val = this.currentpage + 1;
                this.currentpage = val;
            } else {
                val = this.currentpage;
                this.currentpage = val;
            }

            this.SessionHistoryFilter = this.SessionHistoryFilter.slice(
                val * 8 - 8,
                val * 8
            );
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
