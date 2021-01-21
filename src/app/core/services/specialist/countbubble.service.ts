import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../base/http.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CountBubble {
    constructor(private _http: HttpService) {}

    private sessioncount = new Subject<number>();
    private messagecount = new Subject<number>();
    private endpointcount = new Subject<number>();
    private appointmentCount = new Subject<number>();

    // session
    setsessioncount(count: number) {
        this.sessioncount.next(count);
    }

    getsessioncount(): Observable<any> {
        return this.sessioncount.asObservable();
    }

    // VeeClinic Appiointment
    SetAppointmentCount(count: number) {
        this.appointmentCount.next(count);
    }

    //message
    setmessagecount(count: number) {
        this.messagecount.next(count);
    }

    getmessagecount(): Observable<any> {
        return this.messagecount.asObservable();
    }
    //endpoint
    setendpointcount(count: number) {
        this.endpointcount.next(count);
    }

    getendpointcount(): Observable<any> {
        return this.endpointcount.asObservable();
    }

    GetAppointmentsCount() {
        return this.appointmentCount.asObservable();
    }
}
