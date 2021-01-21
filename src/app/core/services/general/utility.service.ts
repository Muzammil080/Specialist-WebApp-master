import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class UtilityService {
    public checkUserPermission(user, permissionCodeName): any {
        let permission = false;

        // for always return true
        // permission = true;
        if (user && user.permissions instanceof Array) {
            user.permissions.forEach(element => {
                // check permission exist
                if (element.permissionCode === permissionCodeName) {
                    permission = true;
                }
            });
        }
        return permission;
    }

    public checkUserPermissionViaPermissions(
        permissions,
        permissionCodeName
    ): any {
        let permission = false;

        // for always return true
        // permission = true;
        if (permissions && permissions instanceof Array) {
            permissions.forEach(element => {
                // check permission exist
                if (element.permissionCode === permissionCodeName) {
                    permission = true;
                }
            });
        }
        return permission;
    }

    public getUserPermissionTooltipMsg(
        permission,
        buttonSubmitted,
        buttonTooltip
    ): any {
        // console.log('permission ', permission);
        // console.log('buttonSubmitted ', buttonSubmitted);
        // console.log('buttonTooltip ', buttonTooltip);
        let msg = '';
        msg = !permission
            ? 'Dont Have Permission'
            : buttonSubmitted
            ? 'Processing'
            : buttonTooltip || '';

        return msg;
    }

    public validateAllFormFields(formGroup: FormGroup) {
        //{1}
        Object.keys(formGroup.controls).forEach(field => {
            //{2}
            const control = formGroup.get(field); //{3}
            if (control instanceof FormControl) {
                //{4}
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                //{5}
                this.validateAllFormFields(control); //{6}
            }
        });
    }

    public newDataInsertInArray(oldArray, newArray): any {
        let data = oldArray || [];

        if (newArray.length > 0) {
            newArray.forEach(element => {
                let check = 0;
                oldArray.forEach(element1 => {
                    if (element.id == element1.id) {
                        check = 1;
                    }
                });
                if (check == 0) {
                    data.push(element);
                }
            });
        }

        return data;
    }

    public dateDifferenceInMonth(date = new Date(), diffNumber = 0): any {
        var newDate = new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth() - diffNumber,
                date.getDate()
            )
        );

        return newDate;
    }

    public dateDifferenceInDays(startDate, endDate): any {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        var days = 0;

        var date1 = new Date(startDate);
        var date2 = new Date(endDate);
        console.log('date1', date1);
        console.log('date2', date2);
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        console.log('date1_ms', date1_ms);
        console.log('date2_ms', date2_ms);

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        days = Math.round(difference_ms / one_day);
        console.log('days', days);

        return days;
    }

    public addDaysInDate(noOfDays = 0, date): any {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;
        var date1 = new Date(date);
        console.log('date1', date1);
        if (date) {
            // Convert both dates to milliseconds
            var date1_ms = date1.getTime();

            console.log('date1_ms', date1_ms);

            // Calculate the addition in milliseconds
            var addition_ms = date1_ms + noOfDays * one_day;

            date1.setTime(addition_ms);
            return date1;
        }

        return null;
    }

    public timeConversion(time = 0, type): any {
        //Get 1 hour in minute
        var one_hour = 60;
        var timeC = 0.0;
        var workingHrsInADay = 8;

        if (time) {
            if (type == 'hour') {
                timeC = time / one_hour;
                timeC = +timeC.toFixed(2);
            } else if (type == 'day') {
                timeC = time / one_hour;
                timeC = +timeC.toFixed(2);
            } else {
                timeC = time * one_hour;
                timeC = +timeC.toFixed();
            }

            // return (timeC | number : '1.2-2');
        }

        return timeC;
    }

    public timeConversionNew(time = 0, newType: string, oldType: string): any {
        //Get 1 hour in minute
        var one_hour = 60;
        var timeC = 0.0;
        var workingHrsInADay = 8;

        switch (oldType) {
            case 'day': {
                if (newType == 'hour') {
                    timeC = time * workingHrsInADay;
                    timeC = +timeC.toFixed(2);
                } else if (newType == 'min') {
                    timeC = time * workingHrsInADay * one_hour;
                    timeC = +timeC.toFixed(2);
                } else timeC = time;
                break;
            }
            case 'hour': {
                if (newType == 'min') {
                    timeC = time * one_hour;
                    timeC = +timeC.toFixed();
                } else if (newType == 'day') {
                    timeC = time / workingHrsInADay;
                    timeC = +timeC.toFixed();
                } else timeC = time;
                break;
            }
            case 'min': {
                if (newType == 'hour') {
                    timeC = time / one_hour;
                    timeC = +timeC.toFixed(2);
                } else if (newType == 'day') {
                    timeC = time / (workingHrsInADay * one_hour);
                    timeC = +timeC.toFixed(2);
                } else timeC = time;
                break;
            }
            default: {
                timeC = time;
                break;
            }
        }

        return timeC;
    }

    public deepCopy(oldObj: any) {
        var newObj = oldObj;
        if (oldObj && typeof oldObj === 'object') {
            newObj =
                Object.prototype.toString.call(oldObj) === '[object Array]'
                    ? []
                    : {};
            for (var i in oldObj) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
        return newObj;
    }

    public phoneNoFunction(event, data = null): any {
        // console.log("phoneNoFunction");
        // if (event.keyCode == 8 || event.keyCode == 9
        //     || event.keyCode == 27 || event.keyCode == 13
        //     || (event.keyCode == 65 && event.ctrlKey === true))
        //     return;
        // if ((event.keyCode < 48 || event.keyCode > 57))
        //     event.preventDefault();
        // var length = data ? data.length : 0;
        // if (length == 3)
        //     return data = data + '-';
        // return data;
    }

    public textFieldtoNumberRestrict(event): any {
        // console.log("phoneNoFunction");

        if (
            event.keyCode == 8 ||
            event.keyCode == 9 ||
            event.keyCode == 27 ||
            event.keyCode == 13 ||
            (event.keyCode == 65 && event.ctrlKey === true)
        )
            return;
        // if ((event.keyCode < 48 || event.keyCode > 57))
        if (
            event.keyCode < 48 ||
            (event.keyCode > 57 && event.keyCode < 96) ||
            event.keyCode > 105
        )
            event.preventDefault();

        // var length = data ? data.length : 0;

        // if (length == 3)
        //     return data = data + '-';

        // return data;
    }

    public checkExistInArray(array, id): any {
        // console.log("checkExistInArray");

        let result: boolean = false;
        // if (this.user.roles.length > 0 && this.user.roles[0].roleCode != 'cad') {
        if (array && array.length > 0) {
            array.forEach(element => {
                if (element.id == id) {
                    result = true;
                }
            });
        }

        return result;
    }

      /**
     * Trims extra spaces
     * @param val
     * @returns trimmed string
     */
    public TrimExtraSpaces(val: string): string {
        return val.replace(/\s+/g, ' ').trim();
    }
}
