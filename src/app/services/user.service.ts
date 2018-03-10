import { Injectable }   from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  /*private serviceUrl = 'data/user.json';
  
  constructor(private http: HttpClient) { }
  
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.serviceUrl);
  }*/

  constructor(private http: HttpClient) {
         var obj;
         this.getUser().subscribe(data => obj=data, error => console.log(error));
    }

    public getUser(): Observable<any> {
         return this.http.get("assets/data/user.json");

     }
}