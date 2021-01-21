import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpService } from '../base/http.service';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { environment } from '../../../../environments/environment';

@Injectable()
export class PatientInfoService {
    constructor(private _http: HttpService) { }

    public patientinfoshare = new Subject<PatientInfo>();
    public isrefreshed: boolean = false;
    public patientStudy = new BehaviorSubject<any>(null);

    sendpatientinfo(data: PatientInfo) {
        console.log('data', data);
        this.patientinfoshare.next(data);
    }

    receivepatientinfo(): Observable<PatientInfo> {
        console.log('receivepatientinfo called');
        console.log('this.patientinfoshare', this.patientinfoshare);
        return this.patientinfoshare.asObservable();
    }

    sendpatientStudy(data) {
        this.patientStudy.next(data);
    }

    receivepatientStudy(): Observable<any> {
        return this.patientStudy.asObservable();
    }

    getpatientInfo(id): Observable<any> {
        return this._http
            .get('specialist/request/' + id + '/patientinfo')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getSpecialistRequestId(): number {
        var request = JSON.parse(sessionStorage.getItem('vidyo'));
        if (request && request.specialistRequestId) {
            return request.specialistRequestId;
        }

        return 0;
    }

    getpatientStoreInfo(): PatientInfo {
        if (sessionStorage.getItem('patientinfo')) {
            return JSON.parse(sessionStorage.getItem('patientinfo'));
        }
        return;
    }

    checkpatinentpacsinfo(mrn): Observable<any> {
        let url = environment.pacsBaseUrl + '/viewerapi/v1/patient/' + mrn;
        return this._http.get('', url).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    deletepatinentpacsinfo(mrn): Observable<any> {
        let url = environment.pacsBaseUrl + '/viewerapi/v1/patient/' + mrn;
        return this._http.delete('', url).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getStrokeImages(): Observable<any> {
        return this._http
            .get('stroke/images')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
    // testapi():Observable<any>
    // {
    //     return this._http.get(""," http://devops/api/country/all").catch((err, caught) => {
    //         return Observable.throw(err);
    //     });

    // }
}

export class PatientInfo {
    id: any;
    visitType: any;
    isUrgent;
    createdBy: any;
    createdOn: any;
    updatedBy: any;
    updatedOn: any;
    isActive: any;
    firstName: any;
    lastName: any;

    mrn: any;
    requestingPhysicianCell: any;
    requestingPhysicianName: any;
    specialistRequestId: any;
    dob: any;
    gender: any;
    specialityId: any;
    heartRate: any;
    topBloodPressure: any;
    bottomBloodPressure: any;
    temperature: any;
    o2Saturation: any;
    handedness: any;
    facilityName: any;
    age: any;
    physicianName: any;
    physicianCell: any;
    reasonForRequest: any;
    lastWellKnownDate: any;
    priority: any;
    currentMedications: any;
    history: any;
    allergies: any;
    comments: any;
    habits: any;
}
