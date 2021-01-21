import { Component } from "@angular/core";

@Component({
    selector: 'user-management-payments',
    moduleId: module.id,
    templateUrl: 'payments.component.html',
    styleUrls: ['../userManagement.component.css']
})

export class PaymentsComponent {
    mockData = [];
    ngOnInit(): void {
        this.mockData =
            [{
                'key': 'Sheet Name',
                'val': 'Primary',
            },
            {
                'key': 'Physician Financials',
                'val': 'Vaca Valley',
            },
            
            ];


    }
}