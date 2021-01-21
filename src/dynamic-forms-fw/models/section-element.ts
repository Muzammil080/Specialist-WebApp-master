import { Parameter } from "./parameter";

export class SectionElement {
    
    id : number;
    sectionId : number;
    parentElementId : number;
    name : string;
    caption : string;
    bindTo : string;
    placeHolder : string;
    cssClass : string;
    elementType : string;
    renderSequence : number;
    isInputField : boolean;

    //attributes
    attributes : Parameter[];
    //parameters 
    parameters : Parameter[];

    //child elements
    childElements : SectionElement[];
    
}