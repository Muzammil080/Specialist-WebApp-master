import { Component, OnInit, OnDestroy } from "@angular/core";
import { InviteService } from "../../core/services/invites/invite.service";
import { Router } from "@angular/router";

@Component({
    selector: "pending-invites",
    templateUrl: "./pending-invites.component.html",
    styleUrls: ["./pending-invites.component.css"],
})
export class PendingInvitesComponent implements OnInit, OnDestroy {
    isLoading: boolean = false;
    invites;
    inviteInterval$: any;

    constructor(private inviteService: InviteService,
        private router :Router) {}

    ngOnInit() {
        this.getPendingInvites();

        this.checkInvites();
    }

    getPendingInvites(noLoading?: boolean){
        this.isLoading = (noLoading==true) ? false : true;
        this.inviteService.getPendingInvites().subscribe(
            (res) => {
                this.invites = JSON.parse(res._body);
                this.invites.forEach(i=>
                {
                        i.createdOn = new Date(i.createdOn + 'Z');
                });
                this.isLoading =false;
            },
            (err) => {
                this.isLoading = false;
            }
        );
    }
    join(invite){
        this.router.navigate(['invite',invite.id,invite.passCode])
    }
    decline(invite){
        this.inviteService.denyInvite(invite.inviteGuid).subscribe(d=>{
            this.getPendingInvites();
        },err=>{

        });
    }

    checkInvites() {
        this.inviteInterval$ = setInterval(()=>{
            this.getPendingInvites(true);
        }, 7 * 1000); // 7 seconds
    }

    ngOnDestroy() {
        if (this.inviteInterval$) {
            clearInterval(this.inviteInterval$);
        }
    }
}
