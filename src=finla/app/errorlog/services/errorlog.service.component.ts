import { Injectable } from "@angular/core";
import { Http, Headers, Response } from '@angular/http';
import { ErrorLogging} from '../model/errorlogmodel';
import { Observable } from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


@Injectable()
export class ErrorLogServiceComponent{
    private BASE_URL = '/apps/ptb/api/login/getlogs';
    private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
errorloggingAPI = '';
constructor(private http: Http) { }


fetchErrorLog(pageNumber:number,searchparem:string) {
    
    let url = searchparem === '' ? `${this.BASE_URL}?pagenum=${pageNumber}&pagesize=20` : `${this.BASE_URL}?pagenum=${pageNumber}&pagesize=20&searchparam=${searchparem}`

    return this.http.get(url, { headers: this.headers })
      .map((response: Response) => {
         
        return response;
      })
      .catch((e) => {
        
        return Observable.throw(e);
      });
  }

 
 private HandleError(error : Response){
    return Observable.throw(error.json().error )
 }



}
