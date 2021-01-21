import { Pipe, PipeTransform } from '@angular/core';
import { StatusService } from '../core/services/user/status.service';
import { MappingService } from '../core/services/mapping/mapping.service';
@Pipe({
  name: 'channelUser'
})
export class ChannelUser implements PipeTransform {

    constructor(private _statusService:StatusService,
        private _mappingService:MappingService){

    }
  transform(value: string): string {
    let user;
    this._statusService.getUserInfo().subscribe(d=>{
         user = this._mappingService.mapUser(d);
    });

    return this.extractValue(value,user.firstName+ " " + user.lastName);

  }

//    extractValue(str,searchStr){

//     var startOfSection = str.indexOf(searchStr);
//     var startOfValue = str.indexOf('"',startOfSection)+1;
//     var endOffValue  = str.indexOf('"',startOfValue); //Position of first char AFTER the value, as needed for substring

//     var value = str.substring(startOfValue,endOffValue);

//     return value;
//     }

extractValue(value:string,valueToRemove:string): string{
    let firstString =  value.replace(valueToRemove,"");
    console.log(valueToRemove);
    console.log(firstString,"first");
    if(firstString == value){
        return value;
    }else{
        let secondString = firstString.replace(",","");
        return secondString;
    }
}

}

