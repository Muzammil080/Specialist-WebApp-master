import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InviteService } from "../../core/services/invites/invite.service";
import { SessionInfo } from "../../core/models/sessionInfo.model";
import * as vars from "../../app.global";

@Component({
    selector: "app-visit",
    templateUrl: "./visit.component.html",
    styleUrls: ["./visit.component.css"],
})
export class VisitComponent implements OnInit {
    inviteId: string;
    passCode: string;
    checkStatusInterval;
    inviteGuid;
    invite;
    isLoading:boolean = true;
    currentDate:Date = new Date();
    version = vars.version;
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private inviteService: InviteService
    ) {}

    ngOnInit() {
        this.inviteId = this.activatedRoute.snapshot.params.inviteId;
        this.passCode = this.activatedRoute.snapshot.params.passCode;
        this.inviteService.join(this.inviteId, this.passCode).subscribe(
            (res) => {
                const d = JSON.parse(res._body);
                this.inviteGuid = d.inviteGuid;
                this.checkStatusInterval = setInterval(()=>{
                    this.checkStatus();
                },500)
            },
            (err) => {
                this.router.navigate([""]);
            }
        );
    }

    checkStatus(){
        this.inviteService.getInviteStatus(this.inviteGuid).subscribe(res=>{
          this.invite = JSON.parse(res._body);
          console.log(this.invite,"invite res");
          if(this.invite.inviteStatus.toLowerCase() == 'allowed'){
              let sessionInfo = new SessionInfo();
              sessionInfo.id  = this.invite.id;
              sessionInfo.host = this.invite.host;
              sessionInfo.platform = this.invite.platform;
              sessionInfo.resourceId = this.invite.sessionResourceId;
              sessionInfo.specialistRequestId = this.invite.specialistRequestId;
              sessionInfo.token = this.invite.token;

              let participantName = this.invite.participantName;
              let primarySpecialistName = this.invite.primarySpecialistName;
              sessionStorage.setItem('primarySpecialistName',primarySpecialistName);
              sessionStorage.setItem('participantName',participantName);
              clearInterval(this.checkStatusInterval);
              sessionStorage.setItem('SessionInfo', JSON.stringify(sessionInfo));
              sessionStorage.setItem("inviteGuid", this.invite.inviteGuid);
              this.router.navigate(['/invite/talk']);
          }else if(this.invite.inviteStatus.toLowerCase() == 'canceled'){
              clearInterval(this.checkStatusInterval);
              this.isLoading = false;
          }
        })
    }
}
