
import { Headers, Response, Http, RequestOptions } from '@angular/http';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { IAuthService } from "./iauth.service";
import { Router, ActivatedRoute } from '@angular/router';
import { User } from "../../models/user";
import { environment } from "../../../../environments/environment";


@Injectable()
export class AuthService implements IAuthService, OnDestroy {


    private messageSource = new BehaviorSubject<boolean>(false);
    currentMessage = this.messageSource.asObservable();



    loginStatusChanged = new Subject<boolean>();

    private _clientId: string = '';
    private _clientSecret: string = '';
    private token_expires: number;
    constructor(private _http: Http, private _router: Router) {
    }

    ngOnDestroy(): void {

    }

    /**
    * Build API url.
    * @param url
    * @returns {string}
    */
    signinstatus(message: boolean) {
        this.messageSource.next(message)
    }
    protected getFullUrl(url: string): string {
        return environment.authBaseUrl + url;
    }

    /**
     * Build API url
     * @param res
     */
    protected getAPIFullUrl(url: String): string {
        return environment.apiBaseUrl + url
    }

    // protected mapUser(res: any): User {
    //     let userData = res.json().genericResponse.genericBody.data.userData;
    //             let isUser = new User();
    //             isUser.fullName =  userData.entity.entityName;
    //             isUser.email =  userData.email;
    //             isUser.firstName =  userData.firstName;
    //             isUser.lastName =  userData.lastName;
    //             isUser.accountVerified =  userData.accountVerified;
    //             isUser.lastLogin =  userData.lastLogin;
    //             isUser.created =  userData.created;
    //             isUser.updated =  userData.updated;
    //             isUser.entityType =  userData.entity.entityType;
    //             isUser.entityId =  userData.entity.id;
    //             isUser.entityName =  userData.entity.entityName;
    //             isUser.webUrl =  userData.entity.websiteUrl;
    //             isUser.token =  userData.token.token;
    //             isUser.id =  userData.id;
    //             // this.isUser.countryId =  userData.countryId;

    //             // let expiryTime = new Date(Date.now());
    //             // expiryTime.setSeconds(expiryTime.getSeconds() + userData.token.expiry);
    //             isUser.expiry =  Date.now() + (userData.token.expiry * 1000);

    //             isUser.roleId =  userData.userRole.id;
    //             isUser.roleName =  userData.userRole.roleName;
    //             isUser.userName =  userData.userName;

    //             return isUser;
    // }
    public SaveToken(response: Response) {

        var d = new Date();
        let data = response.json();

        this.token_expires = (d.getTime() + (data.expires_in * 1000));



        sessionStorage.setItem('token_id_web', data.access_token);
        sessionStorage.setItem('token_id_refresh_web', data.refresh_token);
        sessionStorage.setItem('token_expiry_web', this.token_expires.toString());


        return data;
    }
    checkToken(): boolean {
        if (sessionStorage.getItem('token_id_web')) {
            if ((parseInt(sessionStorage.getItem('token_expiry_web'))) > Date.now()) {
                return true;
            } else {
                //this.logoutUser();
                return false;
            }
        } else {
            // this.logoutUser();
            return false;
        }

    }
    // isLoggedIn(): boolean {

    //     let user = this.getUser();

    //     if (user && user.token && user.expiry) {
    //         if (user.expiry > Date.now())
    //             return true;
    //     }

    //     //    this.loginStatusChanged.next(null);
    //     return false;
    // }


    checkLogin(user: User): Observable<any> {
        // let url = this.getFullUrl('login');
        let url = environment.authBaseUrl;

        let body = {
            entityType: user.entityType,
            email: user.email,
            loginPassword: user.password
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append("Authorization", "Basic " + btoa(environment.client_id + ":" + environment.client_secret));
        let params = new URLSearchParams();
        params.append('grant_type', environment.grant_type);
        params.append('username', user.email);
        params.append('password', user.password);

        return this._http.post(url, params.toString(), { headers: headers })
            .do((res) => {
                this.SaveToken(res);

            });
    }

    refreshToken() {
        let url = environment.authBaseUrl;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append("Authorization", "Basic " + btoa(environment.client_id + ":" + environment.client_secret));
        let params = new URLSearchParams();


        params.append('client_id', environment.client_id);
        params.append('client_secret', environment.client_secret);
        params.append('grant_type', "refresh_token");
        params.append('refresh_token', sessionStorage.getItem('token_id_refresh_web'));


        return this._http.post(url, params.toString(), { headers: headers })
            .do((res) => {
                this.SaveToken(res);

            });
    }

    revokeaccessToken(token) {
        let url = environment.authRevokeUrl;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append("Authorization", "Basic " + btoa(environment.client_id + ":" + environment.client_secret));


        let params = new URLSearchParams();
        params.append('token', token);
        params.append('token_type_hint', "access_token");

        return this._http.post(url, params.toString(), { headers: headers })
            .do((res) => {


            });
    }

    revokerefreshToken(token) {
        let url = environment.authRevokeUrl;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append("Authorization", "Basic " + btoa(environment.client_id + ":" + environment.client_secret));


        let params = new URLSearchParams();
        params.append('token', token);
        params.append('token_type_hint', "refresh_token");

        return this._http.post(url, params.toString(), { headers: headers })
            .do((res) => {

            });

    }


    forgotPassword(user: User): Observable<any> {
        let url = this.getFullUrl('forgetpassword');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            entityType: user.entityType,
            email: user.email,
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {

                return Observable.throw(err);
            });
    }


    resetPassword(user: User, key: string): Observable<any> {

        let url = this.getFullUrl('forgetpassword/verify');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            verificationKey: key,
            loginPassword: user.password,
            confirmPassword: user.confirmPassword,
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {

                return Observable.throw(err);
            });
    }
    checkEntityNameAvailability(entityName, entityType): Observable<any> {

        let url = this.getFullUrl('name/available');

        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            entityName: entityName,
            entityType: entityType
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });

    }
    checkEmailAvailability(emailAddress, entityType): Observable<any> {

        let url = this.getFullUrl('email/available');

        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            email: emailAddress,
            entityType: entityType
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });

    }
    update(user): Observable<any> {

        let url = this.getAPIFullUrl("user/registration/complete");
        let options = new RequestOptions();
        let newOptions = options ? options : new RequestOptions();
        newOptions.headers = this.setHeaders(newOptions.headers);

        let body = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            mobileNumber: user.mobileNumber,
            title: user.title,
            credentials: user.credentials,
            employer: user.employer,
            address: user.address,
            address1: user.address1,
            cityName: user.cityName,
            countryId: user.countryId,
            zipCode: user.zipCode,
            stateId: user.stateId,
            secretQuestion1: user.secretQuestion1,
            secretQuestion2: user.secretQuestion2,
            secretAnswer1: user.secretAnswer1,
            secretAnswer2: user.secretAnswer2
        }
        if (user.specialist.speciality) {
            body['specialist'] = {
                specialityId: user.specialist.speciality ? user.specialist.speciality.id : null,
                deaNumber: user.specialist.deaNumber,
                npiNumber: user.specialist.npiNumber,
                //  physicianLicenseNumber: user.specialist.physicianLicenseNumber,
                practiceGroup: user.specialist.practiceGroup,
                licensedStates: user.specialist.licensedStates,
            }
        }


        return this._http.put(url, body, newOptions)
            .catch((err, caught) => {
                return Observable.throw(err)
            })
    }

    register(user: User): Observable<any> {

        let url = this.getAPIFullUrl('user/registration/init');
        let options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');

        let body = {
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword,
            FirstName: user.firstName,
            LastName: user.lastName,
            MobileNumber: user.mobileNumber,
            Title: user.title,
            Credentials: user.credentials
        }

        return this._http.post(url, body, options)
            .catch((err, caught) => {
                return Observable.throw(err);
            });

    }

    verifyKey(key: string): Observable<any> {
        let url = this.getAPIFullUrl('user/registration/verify');

        let options = new RequestOptions();

        let newOptions = options ? options : new RequestOptions();
        newOptions.headers = this.setHeaders(newOptions.headers);

        let body = { VerificationKey: key }

        return this._http.put(url, body, newOptions)
            .catch((err, caught) => {
                return Observable.throw(err);
            });

    }

    public setHeaders(headers: Headers): Headers {

        let h = headers ? headers : new Headers();
        if (h.keys.length == 0)
            h.append('Content-Type', 'application/json');

        let token = this.getToken();

        if (token) {
            h.append('Authorization', "bearer " + token);
        }

        return h;
    }

    resendEmail(user: User): Observable<any> {
        const url = this.getAPIFullUrl('user/resend/verification/key');
        const options = new RequestOptions();
        options.headers = new Headers();
        options.headers.append('Content-Type', 'application/json');
        options.headers = this.setHeaders(options.headers);

        const body = {};
        return this._http.post(url, body, options).catch((err, caught) => {
            return Observable.throw(err);
        });

    }

    getToken(): string {

        return sessionStorage.getItem('token_id_web');
    }

    getLoggedinUser(): User {
        return this.getUser();
    }

    public storeUser(user: User) {
        if (!user) return;

        sessionStorage.setItem('user_web', JSON.stringify(user));
        if (this.checkToken()) {
            this.loginStatusChanged.next(true);
        }

    }

    public storeUrlPath(urlPath: string) {
        sessionStorage.setItem('urlPath', JSON.stringify(urlPath));
    }

    getUrlPath(): string {
        return JSON.parse(sessionStorage.getItem('urlPath'));
    }

    getUser(): User {
        if (sessionStorage.getItem('user_web')) {
            return JSON.parse(sessionStorage.getItem('user_web'));
        }
        return;
    }

    verifyEmail(email: String) {
        let url = this.getAPIFullUrl("user/email/available/" + email);
        return this._http.get(url).catch((err, caught) => {
            return Observable.throw(err);
        });
    }

    logoutUser() {
        this._router.navigate(['/login']);
        var refreshToken = sessionStorage.getItem('token_id_refresh_web');
        var acessToken = sessionStorage.getItem('token_id_web');

        sessionStorage.removeItem('token_id_web');
        sessionStorage.removeItem('token_id_refresh_web');
        sessionStorage.removeItem('token_expiry_web');
        sessionStorage.removeItem('user_web');
        sessionStorage.removeItem('vidyo');
        sessionStorage.removeItem('reasonForRequest');
        sessionStorage.removeItem('facilityName');
        sessionStorage.removeItem('endpointFilter');
        sessionStorage.removeItem('endpointPartnerSite');
        sessionStorage.removeItem('endpointFacility');
        sessionStorage.removeItem('endpointSortBy');
        sessionStorage.removeItem('endpointStatus');
        sessionStorage.removeItem('specialityName');
        sessionStorage.removeItem('partnerSiteId');

        this.loginStatusChanged.next(false);

        this.revokerefreshToken(refreshToken).subscribe((res) => {

            this.revokeaccessToken(acessToken).subscribe((res) => {




            }, (err) => {

            });

        }, (err) => {

        });

    }

    azureLogin(token,password): Observable<any> {
        let url = environment.authBaseUrl;

        let body = {
            email: token,
            loginPassword: password
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append(
            'Authorization',
            'Basic ' +
            btoa(environment.client_id + ':' + environment.client_secret)
        );
        let params = new URLSearchParams();
        params.append('grant_type', environment.grant_type);
        params.append('username', token);
        params.append('password', password);
        // params.append('client_id', environment.client_id);
        // params.append('client_secret', environment.client_secret);
        //params.append('scope', environment.scope);
        return this._http
            .post(url, params.toString(), { headers: headers })
            .do(res => {
                this.SaveToken(res);
            });
    }

    azurelogout() {
        this._router.navigate(['/adlogout']);
        var refreshToken = sessionStorage.getItem('token_id_refresh_web');
        var acessToken = sessionStorage.getItem('token_id_web');

        sessionStorage.removeItem('token_id_web');
        sessionStorage.removeItem('token_id_refresh_web');
        sessionStorage.removeItem('token_expiry_web');
        sessionStorage.removeItem('user_web');
        sessionStorage.removeItem('vidyo');
        sessionStorage.removeItem('reasonForRequest');
        sessionStorage.removeItem('facilityName');
        sessionStorage.removeItem('endpointFilter');
        sessionStorage.removeItem('endpointPartnerSite');
        sessionStorage.removeItem('endpointFacility');
        sessionStorage.removeItem('endpointSortBy');
        sessionStorage.removeItem('endpointStatus');
        sessionStorage.removeItem('specialityName');
        sessionStorage.removeItem('partnerSiteId');

        this.loginStatusChanged.next(false);

        this.revokerefreshToken(refreshToken).subscribe((res) => {

            this.revokeaccessToken(acessToken).subscribe((res) => {




            }, (err) => {

            });

        }, (err) => {

        });

    }

}
