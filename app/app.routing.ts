import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFound } from './Components/pageNotFound/page-not-found.component';
import { LoginComponent } from './Login/login.component';
import { BillingComponent } from './Billing/billing.component';
import { BpClientApp } from './BpClientApp/bpclientApp.component';
import { AuthGuard } from './auth.guard';
import { ReportingComponent } from './Reporting/Reporting.component';
import { OnlineContentComponent } from './OnlineContent/content.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import{ErrorLoggingComponent} from './errorlog/errorlog_list/errorloglist.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'errorlog', component: ErrorLoggingComponent
  },
  {
    path: '', component: BpClientApp, canActivate: [AuthGuard],
    children: [
      {
        path: 'billing/:taxId',
        component: BillingComponent
      },
      {
        path: 'reports/:taxId',
        component: ReportingComponent
      },
      {
        path: 'contactus', component: ContactUsComponent,
      },
      {
        path: 'content',
        component: OnlineContentComponent
      },
      {
        path: '**', component: PageNotFound
      },
    ],
  },
];

@NgModule({
  imports: [
    NgxDatatableModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    NgbModule.forRoot(),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
