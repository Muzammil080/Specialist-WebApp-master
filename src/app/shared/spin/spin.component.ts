import { Component, OnInit, OnDestroy } from '@angular/core';
import { UIService } from "../../core/services/ui/ui.service";

@Component({
    selector : 'spinner',
    moduleId : module.id,
    templateUrl : 'spin.component.html'
})
export class SpinComponent implements OnInit, OnDestroy {
       
    visible = false;
    
    constructor( private _uiService : UIService){
    }

    ngOnInit(): void {
            this._uiService.spinnerStatus.subscribe(
            (show) => {this.visible = show}
        );
    }

     ngOnDestroy(): void {
        this._uiService.spinnerStatus.unsubscribe();
    }
}