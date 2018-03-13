import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { BillingComponent } from './billing.component';

const routes = [
    {
        path: '',
        component: BillingComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class BillingRoutingModule {

}
