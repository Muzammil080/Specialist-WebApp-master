import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
//import { environment } from "../../../../environments/environment";
@Injectable()
export class PartnersiteService {
    constructor(private _http: HttpService) { }

    getPartnerSite() {
        return this._http.get('partnersites/get').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getPartnerSiteWithIndex(pageIndex, pageSize) {
        return this._http.get('partnersites/get/' + pageIndex + '/' + pageSize).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getPartnerSiteCount() {
        return this._http.get('partnersites/count').catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    getSpecialitiesByPartnersites(id) {
        return this._http.get('partnersite/specialities/get/' + id).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    saveSpecialitiesByPartnersites(data) {
        return this._http.post('partnersite/specialities/save', data).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    savePartnersite(data) {
        return this._http.post('partnersite/add', data).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    updatePartnersite(data) {
        return this._http.put('partnersite/update', data).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    deletePartnersite(id) {
        return this._http.put('partnersite/delete/' + id, null).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    getFacilityByPartnerSiteId(id) {
        return this._http.get('partnersite/facility/' + id)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }

    getFacilityByPartnerSiteIdWithIndex(id, pageIndex, pageSize) {
        return this._http.get('partnersite/facility/' + id + '/' + pageIndex + '/' + pageSize)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }
    getFacilityCount(id) {
        return this._http.get('partnersite/facility/count/' + id)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }
    getEndpointByFacilityId(id) {
        return this._http.get('facility/endpoints/' + id)
            .catch((err, caught) => {
                return Observable.throw(err);
            })
    }
}