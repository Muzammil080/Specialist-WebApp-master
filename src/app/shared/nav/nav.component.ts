import { Component, OnInit, Inject, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { IAuthService } from "../../core/services/auth/iauth.service";
import { RoutingInfoService } from "../../core/services/routInfo/route.info.service";
import { UIService } from "../../core/services/ui/ui.service";
import { Message } from "../../core/models/message";
import { User } from "../../core/models/user";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'nav-bar',
    moduleId: module.id,
    templateUrl: 'nav.component.html'
})
export class NavComponent implements OnInit, OnDestroy {
    user: User = new User();
    // constructor(@Inject('IAuthService') private _authService : IAuthService,
    //             private _routingService : RoutingInfoService) {}
    // constructor( @Inject('IAuthService') private _authService: IAuthService,
    //     private route: ActivatedRoute, private _router: Router,
    //     private _uiService: UIService) { }

    

    ngOnInit(): void {

        

    }

    ngOnDestroy(): void {
        //this._authService.loginStatusChanged.unsubscribe();
    }

    

    
}