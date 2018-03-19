import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot } from '@angular/router';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { LoginService } from './Login/loginService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.loginService.isLoggedIn.
        take(1)
        .map((isLoggedIn: boolean) => {
          if (!isLoggedIn) {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        });
  }
}
