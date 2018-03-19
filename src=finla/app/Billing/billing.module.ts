import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BillingActions } from './billing.actions';
import { BillingService } from './billingService';
import { BillingRoutingModule } from './billing.routing';
import { BpSharedModule } from '../Shared/shared.module';

@NgModule({
    imports: [
        BillingRoutingModule,
        BpSharedModule,
        CommonModule
    ],
    declarations: [],
    providers: [BillingService, BillingActions],
    exports: []
})
export class BillingModule {

}
