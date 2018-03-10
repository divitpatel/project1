import { Injectable } from "@angular/core";
import { Http,Response } from "@angular/http";
import { ErrorLogging } from "../models/errorLoggingModel";
import { Observable } from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


@Injectable()
export class EmpServiceComponent{

empUrl : string  = '/app/emp/data/employee.json'

 constructor(private _http : Http) {


 }   
 
 getEmpployeeList() :  Observable<ErrorLogging[]>{
     return this._http.get(this.empUrl)
     .map((response : Response ) => <ErrorLogging[]>response.json())
     .do((data) => console.log("All my data: ") + JSON.stringify(data))
     .catch(this.HandleError) 
 } 
  getEmpployeeListById(id : number) :  Observable<ErrorLogging>{
     return this.getEmpployeeList()
     .map((employees  : ErrorLogging[]) => employees.find(p=>p.id === id))     
     .catch(this.HandleError) 
 } 

 private HandleError(error : Response){
  console.log(error);
    return Observable.throw(error.json().error )
 }
  


}