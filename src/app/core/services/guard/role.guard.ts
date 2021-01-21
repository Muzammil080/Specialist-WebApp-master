import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { StatusService, Roles } from '../user/status.service';

@Injectable()
export class RoleGuard implements CanActivate {
    UserRoles: Roles[];
    UserRolespermissionCode: string[] = [];

    constructor(
        private router: Router,
        private _statusService: StatusService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        this._statusService.getpermissionCodesParent().subscribe(res => {
            if (res) {
                console.log(this.router.url);
                switch (this.router.url) {
                    case '/home':
                        if (res.Session) {
                            this.router.navigate(['/home']);
                        } else if (res.Messages) {
                            this.router.navigate(['/messages']);
                        } else if (res.Schedule) {
                            this.router.navigate(['/schedule']);
                        } else if (res.Endpoints) {
                            this.router.navigate(['/endpoints']);
                        } else if (res.Specialist) {
                            this.router.navigate(['/specialist']);
                        } else if (res.Radiology) {
                            this.router.navigate(['/radiology']);
                        } else if (res.profile) {
                            this.router.navigate(['/profile']);
                        } else if (res.Opd) {
                            this.router.navigate(['/opd']);
                        }
                        break;
                    case '/messages':
                        if (!res.Messages) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    case '/schedule':
                        console.log(this.router.url);
                        console.log('here');
                        if (!res.Schedule) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    case '/endpoints':
                        if (!res.Endpoints) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    case '/specialist':
                        if (!res.Specialist) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    case '/radiology':
                        if (!res.Radiology) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    case '/profile':
                        if (!res.profile) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    case '/opd':
                        if (!res.Opd) {
                            this.router.navigate(['/home']);
                        }
                        break;
                    default:
                        if (res.Session) {
                            this.router.navigate(['/home']);
                        } else if (res.Messages) {
                            this.router.navigate(['/messages']);
                        } else if (res.Schedule) {
                            this.router.navigate(['/schedule']);
                        } else if (res.Endpoints) {
                            this.router.navigate(['/endpoints']);
                        } else if (res.Specialist) {
                            this.router.navigate(['/specialist']);
                        } else if (res.Radiology) {
                            this.router.navigate(['/radiology']);
                        } else if (res.profile) {
                            this.router.navigate(['/profile']);
                        } else if (res.Opd) {
                            this.router.navigate(['/opd']);
                        } else {
                        }
                        break;
                }
            }
        });
        return true;
    }
}
