import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalysePage } from './analyse.page';

const routes: Routes = [
  {
    path: '',
    component: AnalysePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysePageRoutingModule {}
