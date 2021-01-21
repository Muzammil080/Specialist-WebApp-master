import { Component, OnInit, Inject, ViewChild ,OnDestroy } from '@angular/core'
import { UIService } from "../core/services/ui/ui.service";
import { Message } from "../core/models/message";
import { AuthService } from '../core/services/auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { CountBubble } from './../core/services/specialist/countbubble.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialogRef, MatDialog } from "@angular/material";

@Component({
    selector: 'endpoints',
    moduleId: module.id,
    templateUrl: 'endpoints.component.html',
    styleUrls: ['endpoints.component.css']
})
export class EndPointsComponent implements OnInit , OnDestroy {

   


    constructor(private dialog: MatDialog, private _uiService: UIService, private _authServices: AuthService, private _router: Router, private _route: ActivatedRoute, private _countBubble: CountBubble) {

    }


    ngOnInit(): void {

       
    }
 
    ngOnDestroy(){
        this.dialog.closeAll();
    }
}

