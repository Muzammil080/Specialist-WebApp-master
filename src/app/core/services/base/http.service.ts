import { Injectable, Inject } from '@angular/core';
import {
    Http,
    ConnectionBackend,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    Headers,
    Request
} from '@angular/http';
import { Router, ActivatedRoute ,NavigationEnd} from '@angular/router';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/throw';

import { environment } from '../../../../environments/environment'
import { ILogService } from "../log/ilog.service";
import { IAuthService } from "../auth/iauth.service";
import { LogMessage, LogTypes } from "../../models/log.message";
import { AuthService } from '../auth/auth.service'
import { Message } from '../../models/message';
import { UIService } from '../ui/ui.service';
@Injectable()
export class HttpService {

    newtokenrequested: boolean = false;
    constructor(private _http: Http, private _authServices: AuthService,
        @Inject('ILogService') private _logService: ILogService,
        @Inject('IAuthService') private _authService: IAuthService,
        private _router: Router,
        private _location: Location,
        private uiService: UIService) {
        // super(backend, defaultOptions);
    }

    /**
     * Performs any type of http request.
     * @param url
     * @param options
     * @returns {Observable<Response>}
     */
    public request(url: string, options?: RequestOptionsArgs): Observable<Response> {

        //build complete url
        //base + url
        url = this.getFullUrl(url);

        //setup options and header
        let newOptions = options ? options : new RequestOptions();
        this.setHeaders(newOptions.headers);

        return this._http.request(url, options)
            .catch(this.onCatch)
            .finally(this.onFinally);
    }

    /**
  * Performs a request with `get` http method.
  * @param url
  * @param options
  * @returns {Observable<>}
  */
    public get(url: string, completeurl?: string, options?: RequestOptionsArgs): Observable<any> {

        let newOptions = options ? options : new RequestOptions();
        if (completeurl) {
            url = completeurl;
        } else {
            url = this.getFullUrl(url);
            newOptions.headers = this.setHeaders(newOptions.headers);
        }




        return this._http.get(url, newOptions)
            .catch(this.onCatch.bind(this))
            .finally(this.onFinally);
    }




    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {


        url = this.getFullUrl(url);
        let newOptions = options ? options : new RequestOptions();
        newOptions.headers = this.setHeaders(newOptions.headers);
        return this._http.post(url, body, newOptions)
            .catch(this.onCatch.bind(this))
            .finally(this.onFinally);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {

        url = this.getFullUrl(url);
        let newOptions = options ? options : new RequestOptions();
        newOptions.headers = this.setHeaders(newOptions.headers);

        return this._http.put(url, body, newOptions)
            .catch(this.onCatch.bind(this))
            .finally(this.onFinally);
    }

    public delete(url: string, completeurl?: string, options?: RequestOptionsArgs): Observable<any> {

        let newOptions = options ? options : new RequestOptions();
        if (completeurl) {
            url = completeurl;
        } else {
            url = this.getFullUrl(url);
            newOptions.headers = this.setHeaders(newOptions.headers);
        }

        return this._http.delete(url, newOptions)
            .catch(this.onCatch.bind(this))
            .finally(this.onFinally);
    }


    protected onFinally(): void {
        //ToDo: log final event
    }

    protected onDo(res: Response) {

        let msg: LogMessage = {
            LogType: LogTypes.Information,
            Message: "Successfully completed : " + res.url,
            Tag: 'Base Service,' + res.status
        };

        this._logService.log(msg);
    }

    protected onError(error: any) {
        let msg: LogMessage = {
            LogType: LogTypes.Error,
            Message: "Error in base service. Error :" + error,
            Tag: 'Bsee Service,error'
        }

        this._logService.log(msg);
    }

    protected onCatch(error: any, caught: Observable<any>): Observable<any> {

        // if (error.status == 403 && this.newtokenrequested == false) {
        //     // this._location.back();

        //     sessionStorage.clear();
        //     this._router.navigate(['/login']);
        // }
        if(error.status === 0){
            const message = new Message();
            message.type = 'danger';
            message.iconType = 'error';
            message.msg = "Please check your internet connection";
            this.uiService.showToast(message);
            return Observable.throw(error);
        }

        if (error.status == 401 && this.newtokenrequested == false) {
            this.newtokenrequested = true;
            let url =  environment.authBaseUrl;
            let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            let params = new  URLSearchParams();


            params.append('client_id', environment.client_id);
            params.append('client_secret', environment.client_secret);
            params.append('grant_type', "refresh_token");
            params.append('refresh_token',  sessionStorage.getItem('token_id_refresh_web'));


            return this._http.post(url, params.toString(), { headers: headers })
            .do((res) => {
                this._authServices.SaveToken(res);
                this.newtokenrequested = false;

            },(err) => {

                   this.newtokenrequested = false;
               });


        } else {
            return Observable.throw(error);

        }


    }

    /**
    * Build API url.
    * @param url
    * @returns {string}
    */
    protected getFullUrl(url: string): string {
        return environment.apiBaseUrl + url;
    }

    /**
     * Set headers
     * @param headers
     * @returns {Headers}
     */
    public setHeaders(headers: Headers): Headers {

        let h = headers ? headers : new Headers();
        if (h.keys.length == 0)
            h.append('Content-Type', 'application/json');

        let token = this._authService.getToken();

        if (token) {
            h.append('Authorization', "bearer " + token);
        }

        return h;
    }
}
