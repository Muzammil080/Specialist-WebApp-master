import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { environment } from "../../../../environments/environment";

@Injectable()
export class RadiologyService {
    constructor(private _http: HttpService) { }

    getRadiologyRequests(): Observable<any> {
        return this._http.get("radiology/request/pending").catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getRadiologySignedRequests(id): Observable<any> {
        return this._http.get("clinicalnote/radiology/signed/" + id).catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    getSubTypeByModalityType(modalityType): Observable<any> {
        return this._http.get("clinicalnote/modality/subtype/" + modalityType).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getRadiologyHistory(year, month, day, range): Observable<any> {
        return this._http.get("radiology/request/history/" + year + "/" + month + "/" + day + "/" + range).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getRadiologyUnsigned(): Observable<any> {
        return this._http.get("radiology/request/unsigned").catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getRadiologyRequestById(id): Observable<any> {
        return this._http.get("radiology/request/" + id).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    setRadiologyAction(id, action, modalitySubTypeId?): Observable<any> {
        let data = {
            radiologyRequestId: id,
            performedAction: action,
            modalitySubTypeId: modalitySubTypeId
        }
        return this._http.put("radiology/request/action", data).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    signRadiologyNotes(radiologyRequestId): Observable<any> {
        return this._http.put("clinicalnote/radiology/sign/" + radiologyRequestId, '').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

}

export class RadiologyRequests {
    acceptedOn: any;
    mrn: any;
    dob: any;
    age: any;
    patientName: any;
    priority: any;
    gender: any;
    referenceId: any;
    submittedBy: any;
    submittedTime: any;
    type: any;
    requestDateTime: any;
    specialityId: any;
    modalitySubTypeId: any;
}