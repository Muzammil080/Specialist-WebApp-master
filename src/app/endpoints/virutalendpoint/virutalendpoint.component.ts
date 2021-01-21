import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { UIService } from '../../core/services/ui/ui.service';
import { Message } from '../../core/models/message';
import { Router } from '@angular/router';
import {
    SpecialistRequestService,
    Accepted
} from './../../core/services/specialist/specialistrequests.service';
import { HubConnection } from '@microsoft/signalr';
import { SignalRService } from '../../core/services/signalr/signalr.service';
import { MatPaginator, MatOptionSelectionChange } from '@angular/material';
import { MappingService } from '../../core/services/mapping/mapping.service';
import { StatusService } from '../../core/services/user/status.service';
import { EndpointsService } from '../../core/services/endpoints/endpoints.service';
import { PartnersiteService } from '../../core/services/partnersite/partnersite.services';
@Component({
    selector: "virutalendpoint",
    moduleId: module.id,
    templateUrl: 'virutalendpoint.component.html',
    styleUrls: ['virutalendpoint.component.css']
})
export class VirutalEndpointComponent implements OnInit,OnDestroy {
    facilityName;
    serialNumber;
    endPointId;
    EndpointSessionInfo: Accepted;
    Endpoints: Endpoints[] = [];
    EndpointsFilter: Endpoints[];
    EndpointsFilterPagination: Endpoints[] = [];
    PageLength: number;
    PageLengthrange: number[];
    paginationdisplaybtn = 'none';
    paginationdisplay = 'none';
    paginationdisplayfilter = 'none';
    currentpage = 1;
    zeroResults = 'none';
    visibilityLoginSpinner;
    // firstime;
    private hubConnection: HubConnection;
    nick = '';
    message = '';
    messages: string[] = [];
    timeZone;
    timezoneoffset: number;

    pageIndex = 0;
    pageSize = 10;
    count = 0;
    filter = '';
    partnerSiteId = 0;
    facilityId = 0;
    sortBy = 'name';
    //pass sortByValue to api call
    sortByValue = null;
    currentEndpointStatus = "online";
    partnerSites = [];
    facilities= [];

    endpointName;
    endpointLocation;
    endpointFacilityId;
    pageSizeOptions = [5, 10, 25, 100];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private _signalRService: SignalRService,
        private _statusService: StatusService,
        private _specialistRequestService: SpecialistRequestService,
        private _uiService: UIService,
        private _router: Router,
        private _mappingService: MappingService,
        private _endpointsService: EndpointsService,
        private _partnerSiteService: PartnersiteService
    ) { }

    public sendMessage(): void {
        this.hubConnection
            .invoke('EchoMessage', this.message)
            .catch(err => console.error(err));
    }

    connectEndpoint(val: Endpoints) {
        if (val.kartStatus.toUpperCase() === 'ONLINE') {
            console.log(val,"endpoint");
            this.facilityName = val.facilityName;
            this.serialNumber = val.serialNumber;
            this.endPointId = val.id;
            this.endpointName = val.name;
            this.endpointLocation = val.location;
            const msg = new Message();
            msg.msg = val.id;
            msg.title = '';
            msg.okBtnTitle = 'Connect';
            msg.cancelBtnTitle = 'Not now';
            msg.onOkBtnClick = this.yesClick.bind(this);
            msg.showInput = 'endpoint';
            this._uiService.showMsgBox(msg);
        }
    }
    yesClick(result, id) {
        document.getElementById('call-connecting').style.display = 'block';
        this._specialistRequestService.issessionrequest = true;
        sessionStorage.setItem('endpointFacilityName', this.facilityName);
        sessionStorage.setItem('endpointName', this.endpointName);
        sessionStorage.setItem('endpointLocation', this.endpointLocation);
        sessionStorage.setItem('endpointSerialNumber', this.serialNumber);
        sessionStorage.setItem('endPointId', this.endPointId);
        sessionStorage.setItem('isDirectCall', "true");
        this._specialistRequestService.getEndpointSessioninfo(id).subscribe(
            response => {
                if (response._body !== 'offline' && response._body !== 'busy') {

                        this.EndpointSessionInfo = JSON.parse(response._body);
                        sessionStorage.setItem(
                            'vidyo',
                            JSON.stringify(this.EndpointSessionInfo)
                        );
                        console.log(this.EndpointSessionInfo);
                        if (
                            this.EndpointSessionInfo.platform.toLowerCase() ===
                            'tokbox'
                        ) {
                            this._router.navigate(['/talk/endpoint']);
                        } else {
                            this._router.navigate(['/call/endpoint']);
                        }
                    } else {
                        document.getElementById('call-connecting').style.display =
                            'none';
                        const msg = new Message();
                        msg.msg = 'Somthing went wrong !';
                        this._uiService.showToast(msg);
                    }

            },
            error => {
                document.getElementById('call-connecting').style.display =
                'none';
            }
        );
    }
    getEndpoint() {
        this.visibilityLoginSpinner = 'table-cell';
        this.EndpointsFilter = [];

        this._specialistRequestService
            .getSpecialistEndpoint(this.pageIndex, this.pageSize)
            .subscribe(
                response => {
                    this.visibilityLoginSpinner = 'none';

                    if (response.status === 200) {
                        if (JSON.parse(response._body) != null) {
                            this.Endpoints = JSON.parse(response._body);
                            this.EndpointsFilter = this.Endpoints;

                            if (this.Endpoints.length === 0) {
                                this.zeroResults = 'table-cell';
                            } else {
                                this.zeroResults = 'none';
                            }
                        }
                    }
                },
                error => {
                    this.visibilityLoginSpinner = 'none';
                }
            );
    }

    private getEndpointCount() {
        this._specialistRequestService.getSpecialistEndpointCount().subscribe(
            response => {
                this.count = JSON.parse(response._body);
            },
            error => { }
        );
    }

    // getTimezone() {
    //     const d = new Date();
    //     let offset = d.getTimezoneOffset();

    //     this._statusService.getUserInfo().subscribe(
    //         response => {
    //             const getUser = this._mappingService.mapUser(response);
    //             if (getUser != null) {
    //                 console.log(getUser);
    //                 offset = offset + getUser.utcDSTOffset / 60;
    //                 console.log(offset);
    //                 this.timezoneoffset = offset;
    //                 this.timeZone = getUser.specialist.timeZoneDescription;

    //             }
    //         },
    //         error => { }
    //     );
    // }


    async ngOnInit() {
        if(sessionStorage.getItem('endpointFilter')){
            this.filter = sessionStorage.getItem('endpointFilter');
        }else{
            sessionStorage.setItem('endpointFilter',this.filter);
        }
        if(sessionStorage.getItem('endpointPartnerSite')){
            this.partnerSiteId = +sessionStorage.getItem('endpointPartnerSite');
            this.getFacilities(this.partnerSiteId);
        }else{
            sessionStorage.setItem('endpointPartnerSite',this.partnerSiteId.toString());
        }
        if(sessionStorage.getItem('endpointFacility')){
            this.facilityId = +sessionStorage.getItem('endpointFacility');
        }else{
            sessionStorage.setItem('endpointFacility',this.facilityId.toString());
        }
        if(sessionStorage.getItem('endpointSortBy')){
            this.sortBy = sessionStorage.getItem('endpointSortBy');
        }else{
            sessionStorage.setItem('endpointSortBy',this.sortBy);
        }
        if(sessionStorage.getItem('endpointStatus')){
            this.currentEndpointStatus = sessionStorage.getItem('endpointStatus');
        }else{
            sessionStorage.setItem('endpointStatus',this.currentEndpointStatus);
        }
        this._signalRService.hubConnection.on(
            'EndPointUpdate',
            (endPointId: string, endPointStatus: string) => {
                this.EndpointsFilter.filter(function (el) {
                    if (el.id === +endPointId) {
                        el.kartStatus = endPointStatus;
                    }
                });
            }
        );

        this._signalRService.hubConnection.on('EndpointError', (message) => {
            //we remove this listner on tokbox screen on destroy because the message is needed on that screen
            this._endpointsService.setEndpointError(message);
            console.log(message,"endpoint Error");
         });
        // this.getEndpointCount();
        // this.getEndpoint();
         this.getPartnersites();

        setTimeout(()=>{
            this.whenUserInteract();
        },1000);

    }

    ngOnDestroy(){
        this._signalRService.hubConnection.off('EndPointUpdate');
    }

    pageChanged(event) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        this.whenUserInteract();
    }
    whenUserInteract() {
        // if (this.filter !== null && this.filter !== '') {
        //     this.getEndpointFilter();
        //     this.getEndpointCountFilter();
        //     return;
        // }
        // this.getEndpointCount();
        // this.getEndpoint();

        this.getAccessibleEndpointsFiltered();
        this.getAccessibleEndpointsFilteredCount();

    }
    getEndpointCountFilter() {
        this._specialistRequestService
            .getSpecialistEndpointFilteredCount(this.filter)
            .subscribe(
                response => {
                    this.count = JSON.parse(response._body);
                },
                error => { }
            );
    }
    getEndpointFilter() {
        this.visibilityLoginSpinner = 'table-cell';
        this.EndpointsFilter = [];

        this._specialistRequestService
            .getSpecialistEndpointFiltered(
                this.pageIndex,
                this.pageSize,
                this.filter
            )
            .subscribe(
                response => {
                    this.visibilityLoginSpinner = 'none';

                    if (response.status === 200) {
                        if (JSON.parse(response._body) != null) {
                            this.Endpoints = JSON.parse(response._body);
                            this.EndpointsFilter = this.Endpoints;
                            if (this.Endpoints.length === 0) {
                                this.zeroResults = 'table-cell';
                            } else {
                                this.zeroResults = 'none';
                            }
                        }
                    }
                },
                error => {
                    this.visibilityLoginSpinner = 'none';
                }
            );
    }

    getAccessibleEndpointsFilteredCount() {
        this._endpointsService
            .getAccessibleEndpointsFilteredCount(this.partnerSiteId,this.facilityId,this.filter,this.currentEndpointStatus,this.sortByValue)
            .subscribe(
                response => {
                    this.count = JSON.parse(response._body);
                },
                error => { }
            );
    }
    getAccessibleEndpointsFiltered() {
        this.visibilityLoginSpinner = 'table-cell';
        this.EndpointsFilter = [];
        console.log(this.partnerSiteId , "partnersite id");
        this._endpointsService
            .getAccessibleEndpointsFiltered(
                this.partnerSiteId,
                this.facilityId,
                this.filter,
                this.currentEndpointStatus,
                this.sortByValue,
                this.pageIndex,
                this.pageSize
            )
            .subscribe(
                response => {
                    this.visibilityLoginSpinner = 'none';

                    if (response.status === 200) {
                        if (JSON.parse(response._body) != null) {
                            this.Endpoints = JSON.parse(response._body);
                            console.log(this.Endpoints, "endPoints");
                            this.Endpoints.forEach(x=>{
                                if(x.lastSessionTimeInUtc){
                                    x.lastSessionTimeInUtc = new Date(x.lastSessionTimeInUtc + 'Z');
                                }
                            });
                            this.EndpointsFilter = this.Endpoints;
                            if (this.Endpoints.length === 0) {
                                this.zeroResults = 'table-cell';
                            } else {
                                this.zeroResults = 'none';
                            }
                        }
                    }
                },
                error => {
                    this.visibilityLoginSpinner = 'none';
                }
            );
    }


    onSearchChange() {
        this.pageIndex = 0;
        this.paginator.pageSize = this.pageSize;
        this.paginator.pageIndex = this.pageIndex;

        sessionStorage.setItem('endpointFilter',this.filter);

        this.whenUserInteract();
    }

    getLocalTime(date: any) {
        return new Date(date + 'Z');
    }

    searchByselect(event: MatOptionSelectionChange, type, id){
        this.pageIndex = 0;
        console.log("search by select fired");
        if(this.visibilityLoginSpinner == 'none'){
            if(event.source.selected){
                this.filter = '';
                if(type == 'partnersite'){
                    this.partnerSiteId = id;
                    this.facilityId = 0;
                    sessionStorage.setItem('endpointPartnerSite',this.partnerSiteId.toString());
                    sessionStorage.setItem('endpointFacility',this.facilityId.toString());
                    if(id != 0){
                        this.getFacilities(id);
                    }else{
                        this.facilities = [];
                    }

                }else if(type == 'facility'){
                    this.facilityId = id;
                    sessionStorage.setItem('endpointFacility',this.facilityId.toString());
                }else if(type == 'sort'){
                    if(id == 'name'){
                        this.sortByValue = null;
                    }else{
                        this.sortByValue = id;
                    }
                    this.sortBy = id;
                    sessionStorage.setItem('endpointSortBy',this.sortBy);
                }
                this.whenUserInteract();
            }
        }
    }

    getPartnersites() {
        this._partnerSiteService.getPartnerSite().subscribe(
            response => {
                this.partnerSites = JSON.parse(response._body);
                if(this.partnerSites.length == 1){
                    this.partnerSiteId = this.partnerSites[0].id;
                    sessionStorage.setItem('endpointPartnerSite',this.partnerSiteId.toString());
                    this.getFacilities(this.partnerSiteId);
                }

            },
            error => {}
        );
    }

    getFacilities(id) {
        this._partnerSiteService.getFacilityByPartnerSiteId(id).subscribe(
            response => {
                this.facilities = JSON.parse(response._body);
                this.facilityId = (this.facilities.length==1) ? this.facilities[0].id : this.facilityId;
            },
            error => {}
        );
    }

    endpointStatus(status) {
        this.currentEndpointStatus = status;
        sessionStorage.setItem('endpointStatus',this.currentEndpointStatus);
        //this.getEndpoints(status);
        this.pageIndex = 0;
        this.whenUserInteract();
      }

}

export class Endpoints {
    id: any;
    serialNumber: any;
    kartStatus: any;
    name: any;
    pcName:string;
    // statusUpdatedOn: any;
    // statusUpdatedOnInUtc: any;
    // cameraStatus: any;
    // lastSessionTime: any;
    lastSessionTimeInUtc: any;
    // betteryLifeInSeconds:any;
    partnerSiteName: any;
    location: any;
    // isForDemo: any;
    facilityName: any;
    facilityId:number;
}
