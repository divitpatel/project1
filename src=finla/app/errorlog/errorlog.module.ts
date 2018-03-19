import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDetailComponent } from '../errorlog/errorlog_details/errorlogdetails.component';
import { ErrorLoggingComponent } from '../errorlog/errorlog_list/errorloglist.component';
import { ErrorLogServiceComponent } from '../errorlog/services/errorlog.service.component';
import { ErrorLogRoutingModule } from './errorlog.routing';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@NgModule({
    imports: [
        ErrorLogRoutingModule,
        NgxDatatableModule,
        CommonModule,
    ],
    declarations: [ErrorDetailComponent, ErrorLoggingComponent],
    providers: [ErrorLogServiceComponent],
    exports: []
})
export class ErrorLogModule {

}
