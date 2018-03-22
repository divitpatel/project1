import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { ReportingComponent } from './Reporting.component';

const routes = [
    {
        path: '',
        component: ReportingComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ReportingRoutingModule {

}
