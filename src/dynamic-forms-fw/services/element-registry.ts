import { Type, Injectable} from '@angular/core';
import { IUIElement } from '../interfaces/i-ui-element'

@Injectable()
export class ElementRegistry{

    private _registerElements = new Map<string, Type<IUIElement>>();

    register(elementType : string, element: Type<IUIElement>){
        //check if name has been used by another element
        if(this._registerElements.has(elementType))
            return;
        //throw `Error registering a new element. Element type ${elementType} already exist.`;

        this._registerElements.set(elementType, element);
    }

    getElement(elementType : string) : Type<IUIElement> {
        if(this._registerElements.has(elementType))
            return this._registerElements.get(elementType);
        
        throw `Element type ${elementType} does not exist in element-registery.`;
    }

}