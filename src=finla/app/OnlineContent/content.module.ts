import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { BillingActions } from './billing.actions';
// import { BillingService } from './billingService';
import { OnlineContentRoutingModule } from './content.routing';
import { BpSharedModule } from '../Shared/shared.module';
import { UxModule } from '@anthem/uxd';

import { OnlineContentComponent } from './content.component';
import { ProductInfoComponent } from './productInfo.component';
import { OnlineContentService } from './content.service';
import { LandingPageComponent } from './landingPage.component';
import { ProductDetailsComponent } from './productDetails.component';

@NgModule({
    imports: [
        OnlineContentRoutingModule,
        BpSharedModule,
        CommonModule,
        UxModule
    ],
    declarations: [OnlineContentComponent, ProductInfoComponent, LandingPageComponent, ProductDetailsComponent],
    providers: [OnlineContentService],
    exports: []
})
export class OnlineContentModule {

}
