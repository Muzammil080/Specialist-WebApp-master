import { Injectable } from '@angular/core';
import { HttpService } from '../base/http.service';
import { Observable } from "rxjs/Observable";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {
    isDirectCall:boolean = false;
    endpointError =  new Subject<string>();
  constructor(private _http:HttpService) { }

  setEndpointError(msg: string){
      this.endpointError.next(msg);
  }
  getEndpointError():Observable<any>{
    return this.endpointError.asObservable();
  }
  getAccessibleEndpointsFiltered(partnerSiteId,facilityId,filter,connectionStatus,sortBy,pageIndex,pageSize): Observable<any> {
    if(filter == ''){
        filter = null;
    }
    let body = {
        partnerSiteId : partnerSiteId,
        facilityId: facilityId,
        filter : filter,
        connectionStatus : connectionStatus,
        sortBy : sortBy,
        pageIndex : pageIndex,
        pageSize : pageSize
    }
    return this._http.post("endpoint/accessible",body) .catch((err, caught) => {
        return Observable.throw(err);
    });
   }

   getAccessibleEndpointsFilteredCount(partnerSiteId,facilityId,filter,connectionStatus,sortBy): Observable<any> {
    if(filter == ''){
        filter = null;
    }
    let body = {
        partnerSiteId : partnerSiteId,
        facilityId: facilityId,
        filter : filter,
        connectionStatus : connectionStatus,
        sortBy : sortBy
    }
    return this._http.post("endpoint/accessible/count",body) .catch((err, caught) => {
        return Observable.throw(err);
    });
    }
}
