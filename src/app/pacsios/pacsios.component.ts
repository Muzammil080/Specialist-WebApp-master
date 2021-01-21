import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { UIService } from "../core/services/ui/ui.service";
import { AuthService } from "../core/services/auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
    PatientInfoService,
    PatientInfo
} from "../core/services/specialist/patientinfo.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Pacs } from "../core/main";
import { ViewInstance } from "../core/viewInstance";
import { MalihuScrollbarService } from "ngx-malihu-scrollbar";
import { environment } from "./../../environments/environment";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
@Component({
    selector: "pacsios",
    // moduleId : module.id,
    templateUrl: "pacsios.component.html",
    styleUrls: ["pacsios.component.css"]
})
export class PacsiosComponent implements OnInit, OnDestroy {
    pid: string;
    token: string;
    private sub: any;

    patientInfo: PatientInfo;
    imgPath;
    patientId: number;
    patientStudies: Array<any>;
    public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
    constructor(
        private mScrollbarService: MalihuScrollbarService,
        private domSanitizer: DomSanitizer,
        private _uiService: UIService,
        private _authServices: AuthService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _patientinfoservice: PatientInfoService,
        private viewer: Pacs,
        private instace: ViewInstance
    ) {}

    hubConnection;

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(params => {
            this.pid = params["pid"]; // (+) converts string 'id' to a number
            this.token = params["token"];

            if (this.pid != " " && this.token != " ") {
                //              this.viewer.Authenticate(environment.pacsUserName, environment.pacsUserPassword, '', '', this.pid);
                // let token = this._authServices.getToken();
                this.hubConnection = new HubConnectionBuilder()
                    .withUrl(
                        environment.hubConnection +
                            "signalr/?token=" +
                            this.token +
                            "&connectiontype=user"
                    )
                    .configureLogging(LogLevel.Debug)
                    // .withHubProtocol(new MessagePackHubProtocol())
                    .build();
                this.hubConnection
                    .start()
                    .then(() => {
                        this.hubConnection.invoke("GetPACSCredentials");
                        this.hubConnection.on(
                            "GetPACSCredentials",
                            (username, password) => {
                                this.viewer.Authenticate(
                                    username,
                                    password,
                                    "",
                                    "",
                                    this.pid
                                );
                            }
                        );
                    })
                    .catch(err => {
                        // setTimeout(() => {
                        // this.connectionR();
                        // }, 10000);
                    });
            }

            //  this.findPatientStudy(this.pid);
            // In a real app: dispatch action to load the details here.
        });

        // this.imgPath = "/assets/ct/1.jpg"
    }

    findPatientStudy(val) {
        this.viewer.findStudy(val);
    }

    ngAfterViewInit() {
        //  this.viewer.findStudy('CT12345678');

        //  setTimeout(() => {
        //     this.getSeries(this.pid);
        //  }, 5000);

        this._patientinfoservice.receivepatientStudy().subscribe(data => {
            this.patientStudies = data;
        });

        this.mScrollbarService.initScrollbar(".left-panel ul", {
            axis: "y",
            theme: "dark"
        });
    }

    ngOnDestroy() {
        this.hubConnection.stop();
        this.sub.unsubscribe();
    }

    webViewer() {
        this.viewer.findPatients();
    }

    imgOnClick(id) {
        this.imgPath = "/assets/ct/" + id + ".jpg";
    }

    back() {
        document.getElementById("left-panel").style.visibility = "visible";
    }

    getSeries(series) {
        if (series != null) {
            this.viewer.findSeries(series);
            this.viewer.showSeries(series);

            document.getElementById("left-panel").style.visibility = "hidden";
        }
    }
}
