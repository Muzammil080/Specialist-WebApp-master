import { Pipe, PipeTransform  } from '@angular/core';



@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  
  transform (input: any, separator: string = '.', limit?: number): any {
    
    let x = input.split(separator, limit);
   
    var CDate = new Date(x[0]+'.000Z');
    return CDate;
  }
}

@Pipe({
  name: 'splitNameForAuthor'
})
export class SplitAuthorPipe implements PipeTransform {
  
  transform (input: any, separator: string = ',', limit?: number): any {
    
    let x = input.split(separator, limit);
   
    var data = x[1].replace("_", " ")
    return data;
  }
}