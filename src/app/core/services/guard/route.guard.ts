import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';
import { StatusService } from '../user/status.service';
import { Observable } from 'rxjs/Observable';
import { startOfDay } from 'date-fns';

@Injectable()
export class RouteAcess implements CanActivate {
    constructor(
        private router: Router,
        private _statusService: StatusService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        console.log('this._statusService.pagewasreloaded', this._statusService.pagewasreloaded);
        if (!this._statusService.pagewasreloaded) {
            console.log('page not reloaded');
            return this._statusService.getpermissionCodesParent().map(res => {
                console.log(res);
                if (res) {
                    if (state.url.toString() === '/home' && res.Session) {
                        return true;
                    } else if (
                        state.url.toString() === '/messages' &&
                        res.Messages
                    ) {
                        return true;
                    } else if (
                        state.url.toString() === '/schedule' &&
                        res.Schedule
                    ) {
                        return true;
                    } else if (
                        state.url.toString() === '/endpoints' &&
                        res.Endpoints
                    ) {
                        return true;
                    } else if (
                        state.url.toString() === '/specialist' &&
                        res.Specialist
                    ) {
                        return true;
                    } else if (
                        state.url.toString() === '/radiology' &&
                        res.Radiology
                    ) {
                        return true;
                    } else if (state.url.toString() === '/opd' && res.Opd) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        } else {
            console.log('page reloaded');
            this._statusService.getpermissionCodesParent().subscribe(res => {
                if (res) {
                    console.log(res);
                    console.log('state.url', state.url);
                    console.log('router.url', this.router.url);
                    if (state.url.toString() === '/home' && res.Session && this.router.url === '/home') {
                        console.log('redirect from route guard');
                        this.router.navigate(['/home']);
                    } else if (
                        state.url.toString() === '/messages' &&
                        res.Messages
                    ) {
                        this.router.navigate(['/messages']);
                    } else if (
                        state.url.toString() === '/schedule' &&
                        res.Schedule
                    ) {
                        this.router.navigate(['/schedule']);
                    } else if (
                        state.url.toString() === '/endpoints' &&
                        res.Endpoints
                    ) {
                        this.router.navigate(['/endpoints']);
                    } else if (
                        state.url.toString() === '/specialist' &&
                        res.Specialist
                    ) {
                        this.router.navigate(['/specialist']);
                    } else if (
                        state.url.toString() === '/radiology' &&
                        res.Radiology
                    ) {
                        this.router.navigate(['/radiology']);
                    } else if (
                        state.url.toString() === '/profile' &&
                        res.profile
                    ) {
                        this.router.navigate(['/profile']);
                    } else if (state.url.toString() === '/opd' && res.Opd) {
                        this.router.navigate(['/opd']);
                    }
                }
            });
            return Observable.of(true);
        }
    }
}
