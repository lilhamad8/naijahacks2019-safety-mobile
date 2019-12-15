import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnalysePageRoutingModule } from './analyse-routing.module';

import { AnalysePage } from './analyse.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnalysePageRoutingModule
  ],
  declarations: [AnalysePage]
})
export class AnalysePageModule {}
