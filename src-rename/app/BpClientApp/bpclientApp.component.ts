import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { IAppState } from './../Shared/store/IAppState';
import { NgRedux } from '@angular-redux/store';
import { BpClientAppService } from "./bpClientApp.service";

@Component({
  templateUrl: './bpclientApp.component.html',
  styleUrls: ['./bpclientApp.component.css']
})

export class BpClientApp {
  private loggedInUserInfo;
  private subTitle;
  private config;
  private reactRoutes = ['/commissions', '/renewals', '/clients'];
  constructor(private router: Router, private clientservice: BpClientAppService, private ngRedux: NgRedux<IAppState>,
    private _ref: ChangeDetectorRef) { }

  ngOnInit() {
    //TODO: Use the private property loggedInUserInfo to load the profile information on markup
    this.ngRedux.select(['LoginReducer', 'loggedInUserInfo']).subscribe(val => this.loggedInUserInfo = val);
    this.ngRedux.select(['LoginReducer', 'config']).subscribe(val => this.config = val);
    this.clientservice.pageTitle
      .subscribe(newTitle => { 
        this.subTitle = newTitle;
        //this._ref.detectChanges() 
      });
    this.clientservice.SetPageTitle("Book Of Business");
  }

  navigatePagesByUrl(url) {
    let originLink = window.location.origin;
    const { environment } = this.config.data;
    if (url) {
      if (['/content'].indexOf(url) > -1)
        this.router.navigate([url]);
      else if(url.indexOf("https") !== -1)
        window.open(url, "_blank");
      else {
        const taxId = this.loggedInUserInfo.producer.encryptedTaxId;
        if (this.reactRoutes.indexOf(url) != -1) {
          (environment === 'LOCAL' || environment === 'DEV') ? (originLink = originLink.replace('7073', '7071')) : null;
          window.location.href = `${originLink}/apps/ptb${url}/${taxId}`;
          return;
        }
        this.router.navigate([url, taxId]);
      }
    }
  }

}
