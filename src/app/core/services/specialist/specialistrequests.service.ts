import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../base/http.service';
import { StatusService } from '../user/status.service';


@Injectable()
export class SpecialistRequestService {
    public issessionrequest = false;

    constructor(
        private _statusService: StatusService,
        private _http: HttpService) { }

    getSpecialistRequest(): Observable<any> {
        return this._http
            .get('specialist/requests/pending')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
    getSpecialistRequestcount(): Observable<any> {
        return this._http
            .get('specialist/requests/pending/count')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getSpecialistSessionHistory(year, month, day, range): Observable<any> {
        return this._http
            .get(
                'specialist/session/history/' +
                year +
                '/' +
                month +
                '/' +
                day +
                '/' +
                range
            )
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
    getSpecialistEndpoint(pageIndex: number, pageSize: number): Observable<any> {
        return this._http.get('endpoint/accessible/' + pageIndex + '/' + pageSize).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getSpecialistEndpointCount(): Observable<any> {
        return this._http.get('endpoint/accessible/count').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getSpecialistSessionInfo(id): Observable<any> {
        return this._http
            .get('specialist/request/' + id + '/session')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    setSpecialistRequest(id, action, result): Observable<any> {
        let getUser;

        this._statusService.getUserInfo().subscribe(
            response => {
                getUser = response;
            },
            error => { }
        );

        let body = {
            SpecialistRequestId: id,
            PerformedAction: action,
            PerformedBy: getUser.id,
            Comments: result
        };
        return this._http
            .put('specialist/request/action', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getEndpointSessioninfo(id) {
        return this._http
            .get('endpoint/session/info/' + id)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    pingEnpoint(id) {
        let body = {
            specialistRequestId: id,
            pingType: 'Connected',
            pingClient: 'web',
            isPingBySpecialist: true
        };

        return this._http
            .post('request/ping/add', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    pingEnpointApp(id) {
        let body = {
            sessionId: id,
            pingType: 'Connected',
            pingClient: 'web',
            isPingBySpecialist: true
        };

        return this._http
            .post('session/ping/add', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getSpecialistEndpointFilteredCount(filter: string) {
        return this._http.get('endpoint/accessible/' + filter + '/count').catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    getSpecialistEndpointFiltered(pageIndex: number, pageSize: number, filter: string) {
        return this._http.get('endpoint/accessible/' + filter + '/' + pageIndex + '/' + pageSize).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getSpecialistRequestStatus(specialistRequestId: any) {
        return this._http.get('specialist/request/' + specialistRequestId + '/status').catch((err, caught) => {
            return Observable.throw(err);
        });
    }
}
export class Requests {
    id: any;
    mrn: any;
    specialityId: any;
    specialityName: any;
    facilityId: any;
    facilityName: any;
    status: any;
    pendingSince: any;
    isHighPriority: any;
    reasonForRequest: any;
    endPoint: any;
    endPointId: any;
    endPointName:any;
    endPointLocation:any;
}
export class Accepted {
    id: any;
    host: any;
    token: any;
    resourceId: any;
    specialistRequestId: any;
    facilityName: any;
    facilityId:number;
    serialNumber: any;
    platform: string;
}
