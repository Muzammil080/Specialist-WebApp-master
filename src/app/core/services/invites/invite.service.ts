import { Injectable } from '@angular/core';
import { HttpService } from '../base/http.service';
import { Observable } from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

  constructor(private _http:HttpService) { }

  GetSupportedLanguages(partnerSiteId) {
    return this._http
        .get('interpreter/languages/' + partnerSiteId)
        .catch((err, caught) => {
            return Observable.throw(err);
        });
    }
    GetRelations() {
        return this._http
            .get('participant/relations')
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }
    GetSpecialists(pageIndex,pageSize,specialityId,name) {
        if(name==''){
            name = "null";
        }
            return this._http
                .get('invite/specialist/' + pageIndex + '/' + pageSize + '/' + specialityId + '/' + name)
                .catch((err, caught) => {
                    return Observable.throw(err);
                });
    }
    GetSpecialistsCount(specialityId,name) {
        if(name==''){
            name = "null";
        }
        return this._http
            .get('invite/specialist/count/' + specialityId + '/' + name)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    sendInvite(data) {
        return this._http
            .post('invite/send', data)
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

     /**
     * Gets specialities
     * @param facilityId
     * @returns Observable<any>
     */
    getSpecialities(facilityId: number) {
        return this._http
            .get('facility/specialities/get/' + facilityId)
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
    }
    getAllInvites(id: number,isAppoitment:boolean) {
        if(isAppoitment){
            return this._http
            .get('invite/appointment/' + id)
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
        }else{
            return this._http
            .get('invite/all/' + id)
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
        }

    }

    AllowParticipant(inviteGuid) {
        return this._http
            .put('invite/allowed/' + inviteGuid,{}).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    CancelInvite(inviteGuid) {
        return this._http
            .put('invite/cancel/' + inviteGuid, {}).catch((err, caught) => {
            return Observable.throw(err);
        })
    }
    MuteMic(inviteGuid,isMuteMic) {
        return this._http
            .put('invite/mute/mic/' + inviteGuid + '/' + isMuteMic,{}).catch((err, caught) => {
            return Observable.throw(err);
        })
    }
    MuteCamera(inviteGuid,isMuteCamera) {
        return this._http
            .put('invite/mute/camera/' + inviteGuid + '/' + isMuteCamera,{}).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    Block(inviteGuid) {
        return this._http
            .put('invite/block/' + inviteGuid,{}).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    getPendingInvites() {
        return this._http
            .get('invite/pending')
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
    }

    join(inviteId,passCode) {
        return this._http
            .get('invite/join/' + inviteId+ '/' + passCode)
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
    }

    getInviteStatus(inviteGuid:string){
        return this._http
        .get('invite/' + inviteGuid)
        .catch((err, caught) => {
            return Observable.throwError(err);
        });
    }

    endInvite(inviteGuid:string) {
        return this._http
            .put("invite/end/" + inviteGuid , "")
            .catch((err, caught) => {
                return Observable.throw(err);
            });
    }

    denyInvite(inviteGuid) {
        return this._http
            .put('invite/deny/' + inviteGuid,{}).catch((err, caught) => {
            return Observable.throw(err);
        })
    }

    getPendingInvitesCount() {
        return this._http
            .get('invite/pending/count')
            .catch((err, caught) => {
                return Observable.throwError(err);
            });
    }
}
