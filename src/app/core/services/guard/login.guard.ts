import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnDestroy } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { StatusService, Roles, Permissions, childcomponnet, } from '../user/status.service';
import { Observable } from "rxjs/Observable";

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService) { }

    canActivate(): boolean {

        if (this.authService.checkToken()) {
            return true;
        }
        //Redirect the user before denying them access to this route
        this.router.navigate(['/login']);
        return false;
    }
}



