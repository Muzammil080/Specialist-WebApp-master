import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IUIElement } from '../../interfaces/i-ui-element';
import { SectionElement } from '../../models/section-element';

@Component({
  selector: 'app-ui-container',
  templateUrl: './ui-container.component.html',
  styleUrls: ['./ui-container.component.css']
})
export class UiContainerComponent implements IUIElement, OnInit {

  private _element : SectionElement;

  
  @Input()
  form: FormGroup;
  @Input()
  set uiElementData(element : SectionElement){
    this._element = element;
    //get properties, if required
    //get attributes, if required
    //apply attributes, if required
  }
  get uiElementData() : SectionElement {
    return this._element;
  }
  
  constructor(private _elementRef : ElementRef) { }

  ngOnInit() {
  }

  elementIdTracker(idx: number, element: SectionElement) {
    return element.name;
  }

}
