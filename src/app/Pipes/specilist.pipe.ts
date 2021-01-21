import { Pipe, PipeTransform } from '@angular/core';
import { MappingService } from './../core/services/mapping/mapping.service';
import { StatusService } from './../core/services/user/status.service';
import { addMinutes } from 'date-fns';



@Pipe({
    name: 'specilist'
})
export class SpecilistPipe implements PipeTransform {

    constructor(
        private _statusService: StatusService,
        private _mappingService: MappingService
    ) { }

    timezoneoffset = 0;

    transform(input: any, separator: string = '.', limit?: number): any {

        // debugger;
        if (input != null) {
            const x = input.split(separator, limit);
            this._statusService.getUserInfo().subscribe(
                response => {
                    const offset = new Date().getTimezoneOffset();
                    const getUser = this._mappingService.mapUser(response);
                    if (getUser != null) {
                        this.timezoneoffset = offset + (getUser.utcDSTOffset / 60);
                    }
                }
            );
            const CDate = addMinutes(
                (x[0] + 'Z'),
                this.timezoneoffset
            );
            return CDate;
        } else {
            return new Date('0000-00-00T00:00:00.000Z');
        }

    }
}
