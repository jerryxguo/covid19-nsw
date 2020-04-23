import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaseListComponent } from './components/case-list/case-list.component';
import { LocalGovernmentComponent } from './components/case-list/local-government/local-government.component';
import { SuburbComponent } from './components/case-list/suburb/suburb.component';
import { StateComponent } from './components/case-list/state/state.component';

/** Routes */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'case-list',
    pathMatch: 'full'
  },
  {
    path: 'case-list',
    component: CaseListComponent,
    children: [
      {
        path: '',
        redirectTo: 'state',
        pathMatch: 'full'
      },
      {
        path: 'state',
        component: StateComponent
      },
      {
        path: 'local-government',
        component: LocalGovernmentComponent
      },
      {
        path: 'postcode',
        component: SuburbComponent
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true, onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
