import {
  Component, OnInit, Input, ViewChild,
  ViewContainerRef, AfterViewInit, Injector,
  ComponentFactoryResolver
} from '@angular/core';
import { SectionElement } from '../../models/section-element';
import { FormGroup } from '@angular/forms';
import { ElementRegistry } from '../../services/element-registry';

@Component({
  selector: 'ui-element',
  templateUrl: './ui-element.component.html',
  styleUrls: ['./ui-element.component.css']
})
export class UiElementComponent implements OnInit, AfterViewInit {

  @Input()
  form: FormGroup;
  @Input()
  sectionElement: SectionElement;
  @ViewChild('vc', { read: ViewContainerRef })
  vc: ViewContainerRef;

  constructor(private _injector: Injector,
    private _cfr: ComponentFactoryResolver,
    private _registry: ElementRegistry) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //get constructor of the UI Element
    let componentType = this._registry.getElement(this.sectionElement.elementType);
    //construct instance of UI Component    
    const factory = this._cfr.resolveComponentFactory(componentType);
    const componentRef = factory.create(this._injector);    
    
    setTimeout(() => {
      //inject the new component into the view
      this.vc.insert(componentRef.hostView);
      //set up properties of the component instance
      componentRef.instance.form = this.form;  
      componentRef.instance.uiElementData = this.sectionElement;
      });     
  }

}
