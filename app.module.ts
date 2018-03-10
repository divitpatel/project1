import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { ErrorService } from './services/error.service';

import { AppComponent } from './app.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { ErrorTemplateComponent } from './components/error-template/error-template.component';
import {ErrorLoggingComponent} from './components/logging/errorLogging.component';

@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    ErrorTemplateComponent,
    ErrorLoggingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatTableModule
  ],
  providers: [UserService, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
