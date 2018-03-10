import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { ErrorService } from './services/error.service';
import {RouterModule,Routes} from '@angular/router';
import { AppComponent } from './app.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { ErrorTemplateComponent } from './components/error-template/error-template.component';
import {ErrorLoggingComponent} from './components/logging/errorLogging.component';
import {ErrorDetailComponent} from './components/logging/errordetails/errordetail.component';
import {SearchFilterPipe} from './components/logging/filters/searchfiler.component';

const appRoutes : Routes = [ 
  {path : 'errorlog',component : ErrorLoggingComponent}
  ,{path : 'errorlog/:id',component : ErrorDetailComponent}
  ,{path : '',redirectTo : 'errorlog', pathMatch : 'full' }
  ,{path : '**',redirectTo : 'errorlog', pathMatch : 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    ErrorTemplateComponent,
    ErrorLoggingComponent,
    ErrorDetailComponent,
    SearchFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserService, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
