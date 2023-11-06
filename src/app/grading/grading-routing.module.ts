import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GradingPage } from './grading.page';

const routes: Routes = [
  {
    path: '',
    component: GradingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradingPageRoutingModule {}
