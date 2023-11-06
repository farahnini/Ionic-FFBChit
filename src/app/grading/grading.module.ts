import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GradingPageRoutingModule } from './grading-routing.module';

import { GradingPage } from './grading.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GradingPageRoutingModule
  ],
  declarations: [GradingPage]
})
export class GradingPageModule {}
