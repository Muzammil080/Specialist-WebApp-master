import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ViewPeriod } from 'calendar-utils';
import { CalendarEventModel } from '../../core/models/calander.model';
import { Subject } from 'rxjs';
import { SpecialistScheduleService } from '../../core/services/specialist/specialistschedule.service';
import { MappingService } from '../../core/services/mapping/mapping.service';
import { addMinutes, addHours, startOfDay, setDay } from 'date-fns';
import { StatusService } from '../../core/services/user/status.service';

@Component({
    selector: 'opd-schedule',
    templateUrl: './opd-schedule.component.html',
    styleUrls: ['./opd-schedule.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpdScheduleComponent implements OnInit {
    viewDate: Date = new Date();
    calenderView = 'block';
    LoadingPage = 'none';
    LoadingPageload = 'none';
    viewPeriod: ViewPeriod;
    events: CalendarEventModel[] = [];
    uiEvents: CalendarEventModel[] = [];
    refresh: Subject<any> = new Subject();
    timezoneoffset: number;

    daysInWeek = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
    ];
    constructor(
        private _specialistScheduleService: SpecialistScheduleService,
        private _mappingService: MappingService,
        private _statusService: StatusService
    ) { }

    ngOnInit() {
        this.getTimezone();
        this.loadEvents();
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
                    this.timezoneoffset = offset;
                    // this.timeZone = getUser.stateName;
                }
            },
            error => { }
        );
    }

    private loadEvents() {
        this.calenderView = 'none';
        this.LoadingPage = 'block';
        this._specialistScheduleService.getMySchedule().subscribe(resp => {
            const r = JSON.parse(resp._body);
            this.events = [];
            r.forEach(element => {
                let ev = this._mappingService.mapCalnderEvent(element);
                ev = this.updateTimeZone(ev);
                ev = this.configStartEnd(ev);
                this.events.push(ev);
            });
            this.configUIEvents();
            this.refreshView();
        });
        this.calenderView = 'block';
        this.LoadingPage = 'none';
    }

    configUIEvents() {
        this.events = this.events.sort(function (a, b) {
            return b.start.getTime() - a.start.getTime();
        });
        this.events = this.events.reverse();
        let isFound = false;
        this.events.forEach(event => {
            this.uiEvents.forEach(ev => {
                if (
                    ev.start.getTime() <= event.start.getTime() &&
                    ev.end.getTime() >= event.start.getTime()
                ) {
                    isFound = true;
                    if (ev.end.getTime() <= event.end.getTime()) {
                        ev.end = event.end;
                        ev.endTime = event.endTime;
                    }
                }
            });
            if (!isFound) {
                this.uiEvents.push(event);
            }
            isFound = false;
        });
    }

    updateTimeZone(event: CalendarEventModel): CalendarEventModel {
        event.start = addMinutes(
            event.start,
            this.timezoneoffset
        );
        event.end = addMinutes(event.end, this.timezoneoffset);
        event.startTime.hours = event.start.getHours();
        event.startTime.minutes = event.start.getMinutes();
        event.endTime.hours = event.end.getHours();
        event.endTime.minutes = event.end.getMinutes();
        return event;
    }

    configStartEnd(ev: CalendarEventModel): CalendarEventModel {
        ev.start = addMinutes(
            addHours(
                startOfDay(
                    setDay(
                        new Date(),
                        this.daysInWeek.findIndex(day => day === ev.day)
                    )
                ),
                ev.start.getHours()
            ),
            ev.start.getMinutes()
        );
        ev.end = addMinutes(
            addHours(
                startOfDay(
                    setDay(
                        new Date(),
                        this.daysInWeek.findIndex(day => day === ev.day)
                    )
                ),
                ev.end.getHours()
            ),
            ev.end.getMinutes()
        );

        if (ev.end < ev.start) {
            ev.end = addHours(ev.end, 24);
        }

        ev.title =
            (ev.start.getHours() > 12
                ? ev.start.getHours() - 12
                : ev.start.getHours()
            ).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) +
            ':' +
            ev.start.getMinutes().toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) +
            ' To ' +
            (ev.end.getHours() > 12
                ? ev.end.getHours() - 12
                : ev.end.getHours()
            ).toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) +
            ':' +
            ev.end.getMinutes().toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
        return ev;
    }

    refreshView(): void {
        this.refresh.next();
    }
}
