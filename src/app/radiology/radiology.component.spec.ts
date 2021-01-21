import { ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AuthService } from '../core/services/auth/auth.service'
import { StatusService } from '../core/services/user/status.service'
import { SharedModule } from "../shared/shared.module";
import { UIService } from '../core/services/ui/ui.service'
import { Router, RouterModule,ActivatedRoute }  from '@angular/router'; 
import { SpecialistRequestService,Requests } from "../core/services/specialist/specialistrequests.service"
import { MatCardModule, MatProgressSpinnerModule } from "@angular/material";