import { Injectable }   from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Error } from '../models/error.model';

@Injectable()
export class ErrorService {

  constructor(private http: HttpClient) {
         var obj;
         this.getError().subscribe(data => obj=data, error => console.log(error));
    }

    public getError(): Observable<any> {
         return this.http.get("assets/data/error.json");

     }

}