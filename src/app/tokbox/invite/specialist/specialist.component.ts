import { Component, OnInit, Inject } from '@angular/core';
import { InviteService } from '../../../core/services/invites/invite.service';
import { MAT_DIALOG_DATA, PageEvent, MatOptionSelectionChange } from '@angular/material';
import { UIService } from '../../../core/services/ui/ui.service';
import { Message } from '../../../core/models/message';

@Component({
  selector: 'app-specialist',
  templateUrl: './specialist.component.html',
  styleUrls: ['./specialist.component.css']
})
export class SpecialistComponent implements OnInit {

    isLoading:boolean = false;
    specialityId = 0;
    specialities;
    specialists;

    filter:string = '';
    pageEvent: PageEvent;
    pageIndex: number = 0;
    pageSize: number = 10;
    pageSizeOptions = [5, 10, 15];
    count = 0;

  constructor(private inviteService: InviteService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _uiService:UIService) { }

  ngOnInit() {
    this.getSpecialitiesByFacilityId();
    this.whenUserInteract();

  }

  onSearchChange(){
    this.pageIndex = 0
    this.whenUserInteract();
    }
    whenUserInteract(){
        this.getSpecialists();
        this.getSpecialistsCount();
    }
    pageChanged(event)
    {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getSpecialists();
    }
    getSpecialists(){
        this.isLoading = true;
        this.inviteService.GetSpecialists(this.pageIndex,this.pageSize,this.specialityId,this.filter)
        .subscribe(res=>{
            this.specialists = JSON.parse(res._body);
            this.isLoading = false;
        },err=>{
            this.isLoading = false;
        });
    }

    getSpecialistsCount(){
        this.inviteService.GetSpecialistsCount(this.specialityId,this.filter)
        .subscribe(res=>{
            this.count = JSON.parse(res._body)
        });
    }

    getSpecialitiesByFacilityId(){
        this.inviteService.getSpecialities(this.data.facilityId).subscribe(res=>{
            this.specialities = JSON.parse(res._body);
        });
    }

    searchByselect(event: MatOptionSelectionChange, type,id){
        console.log("searrch by select fired");
        this.pageSize = 10;
        this.pageIndex = 0;

        if(this.isLoading == false){
            if(event.source.selected){
                if(type == 'speciality'){
                    this.specialityId = id;
                }
                this.whenUserInteract();
            }

        }
    }

    selectionChange(ev){
        this.pageIndex = 0;
        this.specialityId = ev.value;
        this.whenUserInteract();
    }

    invite(ev,specialist) {
        this.isLoading = true;
        const data: any = {};
        data.inviteType = {};
        data.inviteType.type = "InternalSpecialist";
        data.SpecialistId = specialist.id;
        if(sessionStorage.getItem('appointmentId')){
            const appointmentId = JSON.parse(
                sessionStorage.getItem('appointmentId')
            );
            data.sessionType = 'appointment';
            data.specialistRequestId = appointmentId;
        }else{
            data.sessionType = 'inpatient';
            data.specialistRequestId = this.data.specialistRequestId;
        }
        this.inviteService.sendInvite(data).subscribe(
            (res) => {
                this.isLoading = false;
                const msg = new Message();
                msg.msg = 'Invite sent';
                msg.type = 'success';
                msg.iconType = 'check_circle';
                this._uiService.showToast(msg);
            },
            (err) => {
                this.isLoading = false;
                if(err.status !== 0){

                    const msg = new Message();
                    msg.msg = err._body;
                    msg.type = 'error';
                    msg.iconType = 'check_circle';
                    this._uiService.showToast(msg);
                }

            }
        );
    }

}
