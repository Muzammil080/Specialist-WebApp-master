import { CalendarEvent, EventColor, EventAction } from 'calendar-utils';

export class Time {
    hours = 0;
    minutes = 0;
}

export class CalendarEventModel implements CalendarEvent {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: { beforeStart?: boolean; afterEnd?: boolean };
    draggable?: boolean;
    meta?: any;

    day: string;
    startTime: Time;
    endTime: Time;
    isDeleted: boolean;

    constructor(day) {
        this.day = day;
        this.startTime = new Time();
        this.endTime = new Time();
    }
}
