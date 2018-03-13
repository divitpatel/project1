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
        path: 'errorlog',
        component: ErrorLoggingComponent
      },
      {
        path: 'reports/:taxId',
        component: ReportingComponent
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
    NgbModule.forRoot(),
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
