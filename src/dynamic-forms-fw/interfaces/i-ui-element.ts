import { Injector } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SectionElement } from "../models/section-element";

export interface IUIElement{
    form : FormGroup;
    uiElementData : SectionElement;
}