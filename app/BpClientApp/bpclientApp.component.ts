import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IAppState } from './../Shared/store/IAppState';
import { NgRedux } from '@angular-redux/store';
import { BpClientAppService } from './bpClientApp.service';
import { loadavg } from 'os';
import { LoginActions } from '../Login/login.action';

@Component({
  templateUrl: './bpclientApp.component.html',
  styleUrls: ['./bpclientApp.component.css'],
})

export class BpClientApp implements OnInit {
  private sub;
  private loggedInUserInfo;
  public subTitle;
  public config;
  private userId;
  private reactRoutes = ['/commissions', '/renewals', '/clients'];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientservice: BpClientAppService,
    private loginAction: LoginActions,
    private ngRedux: NgRedux<IAppState>,
    private _ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loginAction.fetchClientConfig();
    this.loginAction.fetchErrorMap();

    // TODO: Use the private property loggedInUserInfo to load the profile information on markup
    this.ngRedux.select(['LoginReducer', 'loggedInUserInfo']).subscribe(val => this.loggedInUserInfo = val);
    this.ngRedux.select(['LoginReducer', 'config']).subscribe(val => this.config = val);
    this.clientservice.pageTitle
      .subscribe((newTitle) => {
        this.subTitle = newTitle;
        // this._ref.detectChanges()
      });
    this.clientservice.SetPageTitle('Book Of Business');
  }

  navigatePagesByUrl(url) {
    let originLink = window.location.origin;
    const { environment } = this.config.data;
    if (url) {
      if (['/content', '/contactus'].indexOf(url) > -1) {
        this.router.navigate([url]);
      }else if (url.indexOf('https') !== -1) {
        window.open(url, '_blank');
      }else {
        const taxId = this.loggedInUserInfo.producer.encryptedTaxId;
        if (this.reactRoutes.indexOf(url) !== -1) {
          (
            environment === 'LOCAL' ||
            environment === 'DEV' ||
            environment === 'QA'
          ) ? (originLink = originLink.replace('7073', '7071')) : null;
          this.createCookie('userId', this.loggedInUserInfo.userId, 1);
          window.location.href = `${originLink}/apps/ptb${url}/${taxId}`;
          return;
        }
        this.router.navigate([url, taxId]);
      }
    }
  }

  createCookie(name, value, days) {
    let expires;
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date['toGMTString']();
    }else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

}
