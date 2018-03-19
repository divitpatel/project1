import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { ReportingComponent } from './Reporting.component';
// import { CreateReportComponent } from './create-report/Create-Report.component';
// import { BillingService } from './billingService';
// import { BillingActions } from './billing.actions';
import { ReportingRoutingModule } from './Reporting.routing';
import { BpSharedModule } from '../Shared/shared.module';

@NgModule({
    imports: [
        ReportingRoutingModule,
        BpSharedModule,
        CommonModule
    ],
    declarations: [
        // ReportingComponent,
        // CreateReportComponent
    ],
    providers: [],
    exports: []
})
export class ReportingModule {

}
