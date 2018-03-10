import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { ErrorLogging} from '../../logging/models/errorLoggingModel';
import { Subscription }       from 'rxjs/Subscription';
import {errorLoggingList} from '../../logging/data/errorLoggingData';
@Component({
    templateUrl : '../../logging/errordetails/errordeatails.component.html'
})
export class ErrorDetailComponent implements OnInit,OnDestroy {
  
    errorMessage: string;
    errorlog: ErrorLogging;
    pageTitle : string = "Error Detail Page"   
   
sub :  Subscription;

constructor(private _Actroute : ActivatedRoute,
            private _route : Router ){
   
} 

  ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

ngOnInit(): void {
    this.sub = this._Actroute.params.subscribe(
        params => {
         let id = +params['id'];
         this.getEmployeeById(id);
        }

)
}

onBack(): void{
    this._route.navigate(['/errorlog']);
}

getEmployeeById(id : number) {
    this.errorlog = errorLoggingList.filter(item=>item.id === id)[0];  
}
}