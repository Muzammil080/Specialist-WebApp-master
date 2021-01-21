import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { StatusService, Roles, Permissions, childcomponnet, } from '../user/status.service';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserStausGuard implements CanActivate {
  
    constructor(private router: Router,
        private authService: AuthService,
        private _statusService: StatusService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


            return true;
             
    }
}