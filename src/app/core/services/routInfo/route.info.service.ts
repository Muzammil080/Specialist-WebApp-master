import { Injectable, Inject } from '@angular/core';
import { HttpService } from "../base/http.service";
import { RouteInfoModel } from "../../models/routeinfo.model";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";


@Injectable()
export class RoutingInfoService {

    private componentMapping = new Map<string, any>();
    private routingGuards = new Map<string, any> ();

    routingInfo = new Array<RouteInfoModel>();

    routingInfoChanged = new Subject<RouteInfoModel[]>();

    constructor(private _http : HttpService){}


    public init() {
        
      
        
    }

    getRoutes(userRole : string){
         return <Observable<RouteInfoModel>> this._http.get('routes.json');
         
    }
}