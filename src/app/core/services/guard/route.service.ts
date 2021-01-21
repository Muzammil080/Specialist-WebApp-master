import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { Observable } from "rxjs/Observable";
import { HttpService } from "../base/http.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { User } from '../../../core/models/user'
import { Specialist } from '../../../core/models/specialist.model'
import { environment } from "../../../../environments/environment";

@Injectable()
export class RouteService {
    constructor(private _http: HttpService) { }

    private preventNavigation(): void {
        const location = window.document.location;
        const originalHashValue = location.hash;
    
        window.setTimeout(() => {
          location.hash = 'preventNavigation' + (9999 * Math.random());
          location.hash = originalHashValue;
        }, 0);
      }
    
      public disableBrowserNavigation(): void {
        window.addEventListener('beforeunload', this.preventNavigation, false);
        window.addEventListener('unload', this.preventNavigation, false);
      }
    
      public enableBrowserNavigation(): void {
        window.removeEventListener('beforeunload', this.preventNavigation);
        window.removeEventListener('unload', this.preventNavigation);
      }
}

