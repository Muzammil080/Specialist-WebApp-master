import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InviteService } from '../../core/services/invites/invite.service';

@Component({
  selector: 'app-invite-alert',
  templateUrl: './invite-alert.component.html',
  styleUrls: ['./invite-alert.component.css']
})
export class InviteAlertComponent implements OnInit {
    @Input() invite;
    @Output() inviteGuid = new EventEmitter<string>();;
  constructor(private inviteService:InviteService) { }
    participantName;
    participantEmail;
  ngOnInit() {
      this.participantName = this.invite.participantName;
      this.participantEmail = this.invite.participantEmail;
  }

  allowParticipant(){
    this.inviteService.AllowParticipant(this.invite.inviteGuid).subscribe(d=>{
        this.inviteGuid.emit(this.invite.inviteGuid);
    });
  }
  cancelInvite(){
    this.inviteService.CancelInvite(this.invite.inviteGuid).subscribe(d=>{
        this.inviteGuid.emit(this.invite.inviteGuid);
    });
  }

}
