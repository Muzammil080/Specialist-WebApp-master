import { Component } from "@angular/core";

@Component({
    selector: 'user-management-quality-metrics',
    moduleId: module.id,
    templateUrl: 'qualityMetrics.component.html',
    styleUrls: ['../userManagement.component.css']
})

export class QualityMetricsComponent {
    mockData = [];
    ngOnInit(): void {
        this.mockData =
            [{
                'key': 'Average Log in Time',
                'val': '4',
            },
            {
                'key': 'Total Consults',
                'val': '300',
            },
            {
                'key': 'Document Completion %age',
                'val': '89%',
            },
            {
                'key': 'Physician Satisfaction Survey',
                'val': 'Satisfaction',
            },
            {
                'key': 'OPPE',
                'val': 'Done',
            }, {
                'key': 'FPPE',
                'val': 'Done',
            }
            ];


    }
}