import { Pipe, PipeTransform } from "@angular/core";
import { ErrorLogging } from "../models/errorLoggingModel";

@Pipe({
  name : "empFilter"
 })
 export class EmpFileterComponent implements PipeTransform{
    transform(value: ErrorLogging[],filterBy : string) {
return filterBy ? value.filter((emp: ErrorLogging) =>
emp.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1) : value;

    
 }
}