import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaseListComponent } from './components/case-list/case-list.component';
import { TokenInterceptor } from './services/token.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalGovernmentComponent } from './components/case-list/local-government/local-government.component';
import { SuburbComponent } from './components/case-list/suburb/suburb.component';
import { HeaderComponent } from './components/header/header.component';
import { ChartsComponent } from './components/case-list/charts/charts.component';
import { StateComponent } from './components/case-list/state/state.component';

@NgModule({
  declarations: [
    AppComponent,
    CaseListComponent,
    LocalGovernmentComponent,
    SuburbComponent,
    HeaderComponent,
    ChartsComponent,
    StateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
