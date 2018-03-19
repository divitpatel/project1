import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../Shared/store/IAppState';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public loggedInUserInfo;
  private profileNavigation =
    {
      headTitle: 'Profile',
      id:'Profile',
      menu: [
        {
          title: 'Account Details',
          url: '/accountDetails',
          disable: false,
          id: 'accountDetails',
        },
        {
          title: 'LogOut',
          url: '/logout',
          disable: false,
          id: 'logout',
        },
        {
          title: 'Settings',
          url: '/settings',
          disable: false,
          id: 'Settings',
        },
        {
          title: 'Login History And Access Information',
          url: '/loginHistory',
          disable: false,
          id: 'loginHistory',
        },
      ],
    };

  constructor(private router: Router, private ngRedux: NgRedux<IAppState>) { }

  logout= true;
  logOut(e){
    this.router.navigate(['/login']);
    if (e.target.value === 'LogOut'){
      this.logout = true;
    }

  }


  ngOnInit() {
    //TODO: Use the private property loggedInUserInfo to load the profile information on markup
    this.ngRedux.select(['LoginReducer', 'loggedInUserInfo']).subscribe(val => this.loggedInUserInfo = val);
  }

}
