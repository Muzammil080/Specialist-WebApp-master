import { AuthenticationServiceProxy } from '../core/services/proxy/AuthenticationServiceProxy';
import { QueryArchiveServiceProxy } from '../core/services/proxy/QueryArchiveServiceProxy';
import { PatientServiceProxy } from '../core/services/proxy/PatientServiceProxy';
import { PacsQuery } from '../core/models/IQuery';
import { PatientInfoService } from '../core/services/specialist/patientinfo.service';
import { Injectable } from '@angular/core';
import { error } from 'util';
import { environment } from './../../environments/environment';
declare var $: any;

@Injectable()
export class Pacs {
    timerFunctionId: null;
    // Limit the number of query results for servers with large amounts of data
    maxPatientQueryResults: number = 10;
    maxStudyQueryResults: number = 10;
    maxSeriesQueryResults: number = 10;
    maxInstanceQueryResults: number = 40;
    // location_host: string = "dev-aws.veemed.com"
    location_host: string = environment.pacsBaseUrl;
    //location_host = '192.168.1.116';
    AuthenticationToken = '';
    AuthenticationProxy: AuthenticationServiceProxy = null;
    QueryProxy: QueryArchiveServiceProxy = null;
    ViewerWindow: any;
    RemoteLogOut: false;
    PatientProxy = null;
    name: string;
    arg1: string;
    arg2: string;
    extern = { name: '', arg1: '', arg2: '' };
    patientStudyList: Array<any>;
    _mrn: any;

    constructor(private _pi: PatientInfoService) {}

    ExternalCommand(...x: any[]) {
        if (x.length >= 1) {
            this.extern.name = x[0];
        }

        if (x.length >= 2) {
            this.extern.arg1 = x[1];
        }

        if (x.length >= 3) {
            this.extern.arg2 = x[2];
        }
    }

    Authenticate = function(
        userName,
        password,
        errorHandler,
        successHandler,
        Mrn
    ) {
        console.log('Authenticate');
        // var serviceUrl = "https://" + this.location_host + "/MedicalViewerServiceWcf20/AuthenticationService.svc/AuthenticateUser";
        const serviceUrl =
            this.location_host +
            '/MedicalViewerServiceWcf20/AuthenticationService.svc/AuthenticateUser';

        const parameters = {
            userName: userName,
            password: password,
            userData: null
        };

        // const parameters = {
        //     userName: environment.pacsUserName,
        //     password: environment.pacsUserPassword,
        //     userData: null
        // };

        const p = JSON.stringify(parameters);

        console.log(p);

        this._mrn = Mrn;

        return $.ajax({
            type: 'POST',
            contentType: 'application/json',
            async: true,
            url: serviceUrl,
            data: JSON.stringify(parameters),
            error: this.onAuthenticationError,
            success: this.onAuthenticationSuccess.bind(this)
        });
    };

    onAuthenticationSuccess(authentication) {
        console.log('onAuthenticationSuccess');
        this.RemoteLogOut = false;

        this.AuthenticationToken = authentication;
        this.AuthenticationProxy = new AuthenticationServiceProxy(
            this.location_host +
                '/MedicalViewerServiceWcf20/AuthenticationService.svc',
            null
        );
        this.AuthenticationProxy.SetAuthenticationCookie(authentication);

        this.QueryProxy = new QueryArchiveServiceProxy(
            this.location_host +
                '/MedicalViewerServiceWcf20/ObjectQueryService.svc',
            this.AuthenticationProxy
        );
        this.PatientProxy = new PatientServiceProxy(
            this.location_host +
                '/MedicalViewerServiceWcf20/PatientService.svc',
            this.AuthenticationProxy
        );

        this.RunViewer();

        this.findStudy(this._mrn);
    }

    onAuthenticationError(xhr, status, ex) {
        var errorString = '';

        if (ex.hasOwnProperty('message')) {
            var n = ex.message.indexOf('{');
            var j = ex.message.substr(n);
            var error = JSON.parse(j);
            errorString = error.Message;
        } else {
            errorString = ex;
        }
        // this.Logout(false);
    }

    Logout() {}

    RunViewer() {
        if ('' === this.AuthenticationToken) {
            return;
        }

        var url =
            this.location_host +
            '/newViewer/#/login/autologin/' +
            '0/' +
            encodeURIComponent(this.AuthenticationToken);

        // this.ViewerWindow = window.open(url, "MedicalViewer", "location=no,resizable=1");
        this.ViewerWindow = $('<iframe>')
            .css('height', 'calc(100vh - 75px)')
            .css('width', '100%')
            .css('border', '0px') // Creates the element
            .attr('src', url) // Sets the attribute spry:region="myDs"
            // .attr('height', '900px')
            // .attr('width', '100%')
            .appendTo('#pacs_viewer');

        if (!this.ViewerWindow) {
        } else {
            //EnableLogin(false);
        }
    }

    IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    IsViewerActive = function() {
        return this.ViewerWindow != null && !this.ViewerWindow.closed;
    };

    viewerTab: number = 0;
    sendExternalControllerCommand(externalCommand, viewerWindow, url) {
        var p = JSON.stringify(externalCommand);
        this.ViewerWindow[this.viewerTab].contentWindow.postMessage(
            p.toString(),
            url
        );
    }

    findPatients() {
        var queryParams = new PacsQuery();
        this.QueryProxy.FindPatients(
            queryParams,
            this.onErrorFindPatient,
            this.onSuccessFindPatient.bind(this)
        );
        // this.findInstances();
        // this.findStudy();
        // this.findSeries();
        // this.showSeries();
    }

    // findInstances() {
    //     var queryParams = new PacsQuery();
    //     queryParams.options = {};
    //     queryParams.options.SeriesOptions = {};
    //     queryParams.options.SeriesOptions.SeriesInstanceUID = "1.2.392.200036.9107.500.305.5577.557709021107405.121";
    //     this.QueryProxy.FindInstancesMax(queryParams, this.maxInstanceQueryResults, this.onUpdateInstancesError, this.onUpdateInstancesSuccess);

    // }

    /**
     * Method for finding Studies for specific Patient by passing Patient MRN Number
     * @param patientId
     */
    findStudy(patientId) {
        console.log('findStudy', patientId);
        const queryParams = new PacsQuery();
        queryParams.options = {};
        queryParams.options.PatientsOptions = {};
        queryParams.options.PatientsOptions.PatientID = patientId;
        this.QueryProxy.FindStudiesMax(
            queryParams,
            this.maxStudyQueryResults,
            this.onUpdateStudiesError,
            this.onUpdateStudiesSuccess.bind(this)
        );
    }

    /**
     * Method for finding Series for specific Study by passing studyInstanceUid
     * @param studyInstanceUid
     */
    findSeries(studyInstanceUid) {
        const queryParams = new PacsQuery();
        queryParams.options = {};
        queryParams.options.StudiesOptions = {};
        // queryParams.options.StudiesOptions.StudyInstanceUID = "2.16.840.1.114151.4.862.39853.4041.912374";
        queryParams.options.StudiesOptions.StudyInstanceUID = studyInstanceUid;
        this.QueryProxy.FindSeriesMax(
            queryParams,
            this.maxSeriesQueryResults,
            this.onUpdateSeriesError,
            this.onUpdateSeriesSuccess
        );
    }

    /**
     * Method for Communication with External Application just pass study id it will handle all by itseld by passing studyInstanceUid";
     * @param studyInstanceUid
     */
    showSeries(studyId) {
        // this.runExternalControllerCommand('ShowStudy', "2.16.840.1.114151.4.862.39853.4041.912374");
        this.runExternalControllerCommand('ShowStudy', studyId);
    }

    onUpdateInstancesError() {}
    onUpdateInstancesSuccess() {}

    onUpdateSeriesError(error) {}

    onUpdateSeriesSuccess(result) {}

    onUpdateStudiesError(error) {}

    onUpdateStudiesSuccess(result) {
        console.log('onUpdateStudiesSuccess', result);
        if (result != null && result.length > 0) {
            this.patientStudyList = result;

            this._pi.sendpatientStudy(this.patientStudyList);
        }
    }

    onErrorFindPatient(error) {}

    onSuccessFindPatient(result) {}
    // First argument is command name
    // remaining arguments are arg1, arg2, ...
    runExternalControllerCommand(...param: any[]) {
        switch (param.length) {
            case 1:
                this.ExternalCommand(param[0]);
                break;

            case 2:
                this.ExternalCommand(param[0], param[1]);
                break;

            case 3:
                this.ExternalCommand(param[0], param[1], param[2]);
                break;

            case 4:
                this.ExternalCommand(param[0], param[1], param[2], param[3]);
                break;

            case 5:
                this.ExternalCommand(
                    param[0],
                    param[1],
                    param[2],
                    param[3],
                    param[4]
                );
                break;

            case 6:
                this.ExternalCommand(
                    param[0],
                    param[1],
                    param[2],
                    param[3],
                    param[4],
                    param[5]
                );
                break;
        }
        this.sendExternalControllerCommand(this.extern, this.ViewerWindow, '*');
    }
}
