import { Injectable } from '../../../../../node_modules/@angular/core';
import { HttpService } from '../base/http.service';
import { Observable } from '../../../../../node_modules/rxjs/Observable';
import { Subject } from 'rxjs';

@Injectable()
export class ClinicalNotesService {
    /**
     *
     */
    behaviorSubjectUiElement = new Subject<String>();

    constructor(private _http: HttpService) { }

    getUnsignedNotes(): Observable<any> {
        return this._http
            .get(`specialist/session/unsigned`)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getSections(
        specialityId: number,
        specialistRequestId: number,
        worflowInstanceId: number
    ): Observable<any> {
        if (worflowInstanceId) {
            return this._http
                .get(`clinicalnote/workflow/${specialityId}/${worflowInstanceId}`)
                .catch((err, caught) => {
                    return Observable.throw(err);
                });
        } else {
            return this._http
                .get(`clinicalnote/${specialityId}/${specialistRequestId}`)
                .catch((err, caught) => {
                    return Observable.throw(err);
                });
        }
    }


    getRadiologySections(
        radiologyRequestId,
        modalitySubTypeId
    ): Observable<any> {
        return this._http
            .get(
                `clinicalnote/radiology/${modalitySubTypeId}/${radiologyRequestId}`
            )
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getSectionElements(sectionId: number): Observable<any> {
        return this._http
            .get(`clinicalnote/section/${sectionId}`)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getSectionValues(
        specialistRequestId: number,
        sectionId: number,
        specialityId: number,
        workflowInstanceId: number
    ) {

        if (workflowInstanceId) {
            return this._http
                .get(
                    `clinicalnote/workflow/section/values/${workflowInstanceId}/${sectionId}`
                )
                .catch((err, caught) => {
                    return Observable.throw(err);
                });
        } else {
            return this._http
                .get(
                    `clinicalnote/section/values/${specialistRequestId}/${sectionId}/${specialityId}`
                )
                .catch((err, caught) => {
                    return Observable.throw(err);
                });
        }

    }

    getClinicalNotePdf(specialistRequestId: number) {
        return this._http
            .get(
                `clinicalnote/pdf/${specialistRequestId}` +
                `?token=737f61212c1beede43cea0ed4468a2c0658aa623a011170f2ca6187383d2ef79`
            )
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    saveSectionValues(
        specialistRequestId: number,
        clinicalNoteId: number,
        encounterType: string,
        isSigned: boolean,
        clinicalNoteSectionId: number,
        values: any,
        specialityId: number
    ): Observable<any> {
        let valArray = []; //Object.entries(values);
        for (var key in values) valArray.push({ key: key, value: values[key] });

        let body = {
            specialistRequestId: +specialistRequestId,
            clinicalNoteId: clinicalNoteId,
            encounterType: encounterType,
            isSigned: isSigned,
            clinicalNoteSectionId: +clinicalNoteSectionId,
            values: valArray,
            specialityId: +specialityId
        };

        console.log(body);

        return this._http
            .post('clinicalnote/section/save', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    saveWorkflowSectionValues(
        worflowInstanceId: number,
        clinicalNoteId: number,
        encounterType: string,
        isSigned: boolean,
        clinicalNoteSectionId: number,
        values: any
    ): Observable<any> {
        let valArray = []; //Object.entries(values);
        for (var key in values) valArray.push({ key: key, value: values[key] });

        let body = {
            worflowInstanceId: +worflowInstanceId,
            clinicalNoteId: clinicalNoteId,
            encounterType: encounterType,
            isSigned: isSigned,
            clinicalNoteSectionId: +clinicalNoteSectionId,
            values: valArray
        };

        console.log(body);

        return this._http
            .post('clinicalnote/workflow/section/save', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getApptUnsignedNotes(
        pageIndex,
        pageSize
    ): Observable<any> {


        let body = {
            to: null,
            from:null,
            mrn:null,
            patientLastName:null,
            patientFirstName:null,
            specialistName:null,
            pageIndex:pageIndex,
            pageSize:pageSize,
            isFilterOn:false
        };

        return this._http
            .post('appointment/unsigned/notes', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    getApptUnsignedNotesCount(): Observable<any> {

        let body = {
            to: null,
            from:null,
            mrn:null,
            patientLastName:null,
            patientFirstName:null,
            specialistName:null,
            isFilterOn:false
        };

        return this._http
            .post('appointment/unsigned/notes', body)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
}
