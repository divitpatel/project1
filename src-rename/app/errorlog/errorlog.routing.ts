import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import {ErrorDetailComponent} from '../errorlog/errorlog_details/errorlogdetails.component';
import {ErrorLoggingComponent} from '../errorlog/errorlog_list/errorloglist.component';

const routes = [
    {
        path: '',
        component: ErrorDetailComponent
    },
    {path : 'errorlog',component : ErrorLoggingComponent}
  ,{path : 'errorlog/:id',component : ErrorDetailComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ErrorLogRoutingModule {

}
