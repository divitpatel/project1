import { RouterModule, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { OnlineContentComponent } from './content.component';

const routes = [
    {
        path: '',
        component: OnlineContentComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class OnlineContentRoutingModule {

}
