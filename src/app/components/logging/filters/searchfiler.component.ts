import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { ErrorLogging} from '../../logging/models/errorLoggingModel';
@Pipe({
 name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
    transform(value: ErrorLogging[],filterBy : string) {
        return filterBy ? value.filter((emp: ErrorLogging) =>
        emp.userName.toUpperCase().indexOf(filterBy.toUpperCase()) !== -1) : value;
//  transform(items: any[], field: string, value: string): any[] {
//    if (!items) return [];
//    return items.filter(it => it[field] == value);
 }
}