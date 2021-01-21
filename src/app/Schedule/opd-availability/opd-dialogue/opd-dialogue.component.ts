import {
    Component,
    OnInit,
    Inject
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CalendarEventModel, Time } from '../../../core/models/calander.model';
import { StatusService } from '../../../core/services/user/status.service';
import {
    addMinutes,
    setHours,
    setMinutes,
    startOfDay,
    setMilliseconds
} from 'date-fns';
import { Message } from '../../../core/models/message';
import { UIService } from '../../../core/services/ui/ui.service';
import { SpecialistScheduleService } from '../../../core/services/specialist/specialistschedule.service';
import { MappingService } from '../../../core/services/mapping/mapping.service';

@Component({
    selector: 'app-opd-dialogue',
    templateUrl: './opd-dialogue.component.html',
    styleUrls: ['./opd-dialogue.component.css']
})
export class OpdDialogueComponent implements OnInit {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };

    hours: number[];
    minutes: number[];
    timeZone;
    timezoneoffset: number;
    hiddenLoader = true;
    hiddenSaveLoader = true;
    availabilitySlots = [];
    hiddenList = false;
    events: CalendarEventModel[];

    daysInWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    defaultZone = 1;
    constructor(
        public dialogRef: MatDialogRef<OpdDialogueComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _statusService: StatusService,
        private _uiService: UIService,
        private _specialistScheduleService: SpecialistScheduleService,
        private _mappingService: MappingService
    ) {
        this.events = data.events;
        this.addEvent();
        this.getTimezone();
    }

    ngOnInit() {
        // this.timeZone = 'Local';
        this.createTime();
    }
    private createTime() {
        this.hours = Array.from({ length: 24 }, (x, i) => i);
        this.minutes = Array.from({ length: 60 }, (x, i) => i);
    }

    getTimezone() {
        const d = new Date();
        let offset = d.getTimezoneOffset();

        this._statusService.getUserInfo().subscribe(
            response => {
                const getUser = this._mappingService.mapUser(response);
                if (getUser != null) {
                    console.log(getUser);
                    offset = offset + getUser.utcDSTOffset / 60;
                    // console.log(offset);
                    this.timezoneoffset = offset;
                    this.timeZone = getUser.specialist.timeZoneDescription;
                }
            },
            error => { }
        );
    }

    addEvent() {
        this.events.push(
            new CalendarEventModel(this.daysInWeek[this.data.day].toLowerCase())
        );
    }

    changeTimeZone() {
        switch (this.defaultZone) {
            case 1:
                this.events.forEach(ev => {
                    if (ev.start) {
                        ev.startTime.hours = ev.start.getHours();
                        ev.startTime.minutes = ev.start.getMinutes();
                    }
                    if (ev.end) {
                        ev.endTime.hours = ev.end.getHours();
                        ev.endTime.minutes = ev.end.getMinutes();
                    }
                });
                break;
            case 2:
                this.events.forEach(ev => {
                    // console.log(new Date(ev.start.toUTCString()));
                    if (ev.start) {
                        ev.startTime.hours = ev.start.getUTCHours();
                        ev.startTime.minutes = ev.start.getUTCMinutes();
                    }
                    if (ev.end) {
                        ev.endTime.hours = ev.end.getUTCHours();
                        ev.endTime.minutes = ev.end.getUTCMinutes();
                    }
                });
                break;
            case 3:
                this.events.forEach(ev => {
                    if (ev.start) {
                        const startTime = addMinutes(
                            ev.start,
                            this.timezoneoffset
                        );
                        ev.startTime.hours = startTime.getHours();
                        ev.startTime.minutes = startTime.getMinutes();
                    }
                    if (ev.end) {
                        const endTime = addMinutes(ev.end, this.timezoneoffset);
                        ev.endTime.hours = endTime.getHours();
                        ev.endTime.minutes = endTime.getMinutes();
                    }
                });
                break;

            default:
                break;
        }
    }

    changeStartTime(eventId: number) {
        let d = new Date();
        this.events.forEach(ev => {
            if (ev.id === eventId) {
                d = setHours(d, ev.startTime.hours);
                d = setMinutes(d, ev.startTime.minutes);
                ev.start = d;

                let d1 = new Date();
                d1 = setHours(d1, ev.endTime.hours);
                d1 = setMinutes(d1, ev.endTime.minutes);
                ev.end = d1;
            }
        });
    }

    changeEndTime(eventId: number) {
        let d = new Date();
        this.events.forEach(ev => {
            if (ev.id === eventId) {
                d = setHours(d, ev.endTime.hours);
                d = setMinutes(d, ev.endTime.minutes);
                ev.end = d;

                let d1 = new Date();
                d1 = setHours(d1, ev.startTime.hours);
                d1 = setMinutes(d1, ev.startTime.minutes);
                ev.start = d1;
            }
        });
    }

    close() {
        this.dialogRef.close();
    }

    save() {

        this.hiddenSaveLoader = false;
        let isValid = true;
        let evnts = this.events.filter(
            e => e.start !== undefined || e.end !== undefined
        );
        const pushEvents = [];
        evnts.forEach(ev => {
            if (
                ev.endTime.hours === 0 &&
                ev.endTime.minutes === 0 &&
                ev.startTime.hours === 0 &&
                ev.startTime.minutes === 0
            ) {
            } else {
                pushEvents.push(ev);
            }
        });

        evnts = pushEvents;
        evnts.forEach(ev => {
            if (
                ev.start >= ev.end ||
                ev.startTime === ev.endTime ||
                ev.start === ev.end
            ) {
                isValid = false;
                this.createToastMessage({
                    msg:
                        'Shift End time should be greater than Shift Start time.',
                    iconType: 'error',
                    type: 'danger'
                });
                return;
            }
        });
        if (!isValid) {
            this.hiddenSaveLoader = true;
            return;
        }
        evnts.forEach(ev => {
            ev.start = addMinutes(ev.start, this.timezoneoffset * -1);
            ev.end = addMinutes(ev.end, this.timezoneoffset * -1);
        });
        this._specialistScheduleService.saveMySchedule(evnts).subscribe(
            res => {
                const success = new Message();
                success.msg = 'Data successfully uploaded';
                success.type = 'success';
                success.iconType = 'done';
                this._uiService.showToast(success);
                this.dialogRef.close();
            },
            err => {
                this.hiddenSaveLoader = true;
                console.log(this.hiddenSaveLoader , 'hidden save loader');
                const message = new Message();
                message.msg = err._body;
                message.type = 'danger';
                message.iconType = 'error';
                if (err.status === 401) {
                    message.msg = 'Login session expired';
                }
                this._uiService.showToast(message);
            }
        );
    }

    private createToastMessage(obj) {
        const message = new Message();
        message.msg = obj.msg;
        message.type = obj.type;
        message.iconType = obj.iconType;
        this._uiService.showToast(message);
    }
}
