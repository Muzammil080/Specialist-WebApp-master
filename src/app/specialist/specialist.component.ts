import { Component, OnInit, Inject,OnDestroy } from '@angular/core'
import { UIService } from "../core/services/ui/ui.service";
import { Message } from "../core/models/message";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService} from '../core/services/auth/auth.service'
import { Router, ActivatedRoute  }  from '@angular/router';  
import { SpecialistRequestService,Requests,Accepted } from "../core/services/specialist/specialistrequests.service";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {CountBubble} from './../core/services/specialist/countbubble.service'
import { MessageService } from './../core/services/specialist/message.service'
import { PatientInfoService, PatientInfo } from "../core/services/specialist/patientinfo.service";
import { ISubscription } from "rxjs/Subscription";
import { MatOptionSelectionChange } from "@angular/material";
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {SpecialistService} from './../core/services/specialist/specialist.service';
import { User } from './../core/models/user'
import { MatDialogRef, MatDialog } from "@angular/material";
export class State {
    constructor(public id: string, public name: string) { }
}

@Component({
selector : 'specialist',
moduleId : module.id,
templateUrl : 'specialist.component.html',
styleUrls :  ['specialist.component.css']
})

export class SpecialistComponent implements OnInit , OnDestroy {
   
    


    constructor(private dialog: MatDialog, private _specialist: SpecialistService,private _messageService : MessageService ,private _uiServices : UIService ,private _authServices: AuthService,private _router: Router,private _route: ActivatedRoute,private _specialistRequestService:SpecialistRequestService, private _countBubble:CountBubble,private _patientinfoservice:PatientInfoService ){   
        
    }
    
    stateCtrl: FormControl;
    filteredStates: Observable<any[]>;
    user: User[];
    states: State[] = [] ;
    defaultvalue;
    specilistserach;
    currentspeciality;
    Loadingpage='none';
    zeroResults='none';
    filterStates(name: string) {
        return this.states.filter(state =>
          state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
      }

      getSpecilistlist(event: MatOptionSelectionChange, id) 
      {
          
          if (event.source.selected) {
            this.user=null;
            this.Loadingpage="block";
            this.zeroResults='none';
          
            this.currentspeciality =id;
            this._specialist.getSpecialist(id,0,100,null).subscribe(
                (response) => { 
                    this.Loadingpage="none";
                    this.user = JSON.parse(response._body);
                 
                    if (this.user.length == 0) {
                        this.zeroResults='table-cell';
                    }
                },
                (error) =>{}
            );
        }

      }
      specilistserachfilter()
      {
        this.user=null;
        this.Loadingpage="block";
        this.zeroResults='none';
        
         var specilistserach = this.specilistserach;
         
         this._specialist.getSpecialist(this.currentspeciality,0,100,specilistserach.replace(/[^a-zA-Z0-9]/g, '')).subscribe(
            (response) => { 
                this.Loadingpage="none";
                this.user = JSON.parse(response._body);
                if (this.user.length == 0) {
                    this.zeroResults='table-cell';
                }
            },
            (error) => {}
        );
         
      }
      specilistserachfilterclear()
      {
        this.user=null;
        this.Loadingpage="block";
        this.zeroResults='none';
          this.specilistserach='';
          this._specialist.getSpecialist(this.currentspeciality,0,100,null).subscribe(
            (response) => { 
                this.Loadingpage="none";
                this.user = JSON.parse(response._body);
                if (this.user.length == 0) {
                    this.zeroResults='table-cell';
                }
            },
            (error) =>{}
        );
      }
    ngOnInit():void
    { 
        this.user=null;
        this.Loadingpage="block";
        this.zeroResults='none';
        this._specialist.getSpeciality().subscribe(
            (response) => { 
                this.states = JSON.parse(response._body);

                this.defaultvalue= this.states[0].name;
                this.currentspeciality=this.states[0].id;
                this._specialist.getSpecialist(this.states[0].id,0,100,null).subscribe(
                    (response) => { 
                        this.Loadingpage="none";
                        this.user = JSON.parse(response._body);
                        if (this.user.length == 0) {
                            this.zeroResults='table-cell';
                        }
                    },
                    (error) => {
                    this.Loadingpage="none";
                    }
                );

                this.filteredStates = this.stateCtrl.valueChanges
                .pipe(
                  startWith(''),
                  map(state => state ? this.filterStates(state) : this.states.slice())
                );
            },
            (error) => {
                
            }
        )

        this.stateCtrl = new FormControl();
    }

    ngOnDestroy()
    {
       
    }
  
}

