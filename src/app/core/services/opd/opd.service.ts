import { Injectable } from '@angular/core';
import { HttpService } from '../base/http.service';
import { Observable } from 'rxjs/Observable';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class OpdService {

    public issessionrequest = false;

    constructor(private _http: HttpService) { }

    getAppointmentRequest() {
        const body = {
            from: startOfDay(new Date()).toUTCString(),
            to: endOfDay(new Date()).toUTCString()
        };
        return this._http
            .post('appointment/session/requested', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    AcceptSessionRequest(id: any) {
        return this._http
            .put('appointment/accept/session/' + id, '')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    GetSessionInfo(id: any) {
        return this._http
            .get('appointment/session/info/' + id)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getMyAppointmentsCount(data: {
        to: string;
        from: string;
        mrn: string;
        patientLastName: string;
        patientFirstName: string;
        pageIndex: number;
        pageSize: number;
        isFilterOn: boolean;
    }) {
        return this._http
            .post('appointment/self/list/filtered/count', data)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getMyAppointments(data: {
        to: string;
        from: string;
        mrn: string;
        patientLastName: string;
        patientFirstName: string;
        pageIndex: number;
        pageSize: number;
        isFilterOn: boolean;
    }) {
        return this._http
            .post('appointment/self/list/filtered', data)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    EndSession(appointmentId: any) {
        return this._http
            .put('appointment/end/session/' + appointmentId, '')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    GetPatientInfo(appointmentId: any) {
        return this._http
            .get('appointment/patient/info/' + appointmentId, '')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    /**
     * Cancels appointment
     * @param appointmentId
     * @returns success
     */
    cancelAppointment(appointmentId: number): Observable<any> {
        return this._http
            .put('appointment/cancel/' + appointmentId, '')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
}
