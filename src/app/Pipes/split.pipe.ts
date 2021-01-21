import { Pipe, PipeTransform  } from '@angular/core';



@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  
  
  transform (input: any, separator: string = '.', limit?: number): any {
   
    // debugger;
    if (input != null) {
      let x = input.split(separator, limit);
      
       var CDate = new Date(x[0]+'.000Z');
       return CDate;
    }else{
      return new Date("0000-00-00T00:00:00.000Z");
    }
     
  }
}

@Pipe({
  name: 'myTime'
})
export class MyTimePipe implements PipeTransform {
  transform(value: number): string {
    //  if(value > 0 && value/60 < 1) {
      

    //  } else {
    //    return value/60 + ' Hours';
    //  }
    return value + ' Min';
  }
}