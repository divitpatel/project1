import { AppConfig, AppSession } from '@anthem/main';
import { AppConfig2 } from './appConfig';
import { AppSession2 } from './appSession';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@anthem/core';
import { Http2Module } from '@anthem/http';
import { SharedModule2 } from '@anthem/cns-shared';
import { SharedModule, CustomDatePipe, CustomCurrencyPipe } from '@anthem/shared';
import { UxModule } from '@anthem/uxd';
import { UtilityModule } from '@anthem/utility';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, store } from './Shared/store';
import { rootReducer } from './Shared/store/rootReducers';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { PageNotFound } from './Components/pageNotFound/page-not-found.component';
import { LoginComponent } from './Login/login.component';
import { BillingComponent } from './Billing/billing.component';
import { BillingService } from './Billing/billingService';
import { LoginService } from './Login/loginService';
import { BpClientAppService } from './BpClientApp/bpClientApp.service';
import { LoginActions } from './Login/login.action';
import { BillingActions } from './Billing/billing.actions';
import { BpClientApp } from './BpClientApp/bpclientApp.component';
import { AuthGuard } from './auth.guard';
import { SortComponent } from './Components/sort/sort.component';
import { SortAndFilterComponent } from './Components/sort-and-filter/sort-and-filter.component';
import { ErrorLogModule}  from './errorlog/errorlog.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

// TODO: this is temporary and will be moved to reporting module
import { ReportingComponent } from './Reporting/Reporting.component';
import { CreateReportComponent } from './Reporting/create-report/Create-Report.component';
import { ReportService } from './Reporting/reportService';
import { ReportActions } from './Reporting/action';
import { ListViewHeaderComponent } from './Components/list-view-header/list-view-header.component';
import { TagsContainerComponent } from './Components/tags-container/tags-container.component';
import { FilterComponent } from './Components/filter/filter.component';

// Modules
import { BpSharedModule } from './Shared/shared.module';
import { SafeMarkupDirective } from './Shared/Directives/safeMarkup.directive';
import { OnlineContentModule } from './OnlineContent/content.module';
import { SearchComponent } from './Components/search/search.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import {ErrorDetailComponent} from './errorlog/errorlog_details/errorlogdetails.component';

const initialState: IAppState = {
  loggedInUserInfo: null,
  config: null,
  jwtToken: null,
  errorMap: null
};

export function getAppSession(appSession: AppSession) {
  return appSession;
}

//istanbul ignore next
export function getAppConfig(appConfig: AppConfig) {
  return appConfig;
}

//istanbul ignore next
export function getWindow() {
  return window;
}

//istanbul ignore next
export function getCustomDatePipe(datePipe: CustomDatePipe) {
  return datePipe;
}

//istanbul ignore next
export function getCurrencyPipe(pipe: CustomCurrencyPipe) {
  return pipe;
}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgReduxModule,
    AppRoutingModule,
    ErrorLogModule,
    BpSharedModule,
    OnlineContentModule,
    CoreModule.forRoot(),
    Http2Module.forRoot(),
    SharedModule.forRoot(),
    SharedModule2.forRoot(),
    UxModule.forRoot(),
    UtilityModule.forRoot(),
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFound,
    BpClientApp,
    ReportingComponent,
    CreateReportComponent,
    BillingComponent,
    ListViewHeaderComponent,
    TagsContainerComponent,
    SortComponent,
    FilterComponent,
    SortAndFilterComponent,
    SearchComponent,
    ContactUsComponent,
    SafeMarkupDirective,
  ],
  providers: [
    AppConfig2,
    LoginService,
    BillingService,
    BpClientAppService,
    LoginActions,
    ReportService,
    ReportActions,
    BillingActions,
    AuthGuard,
    AppSession2,
    {
      provide: DatePipe,
      deps: [CustomDatePipe],
      useFactory: getCustomDatePipe
    },
    {
      provide: CurrencyPipe,
      deps: [CustomCurrencyPipe],
      useFactory: getCurrencyPipe
    },
    {
      provide: 'Window',
      useFactory: getWindow
    },
    {
      provide: AppConfig,
      deps: [AppConfig2],
      useFactory: getAppConfig
    },
    {
      provide: AppSession,
      deps: [AppSession2],
      useFactory: getAppSession
    }

  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.provideStore(store);
  }


}
