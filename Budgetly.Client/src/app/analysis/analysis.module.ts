import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryHeaderComponent } from './secondary-header/secondary-header.component';
import { AnalysisComponent } from './analysis.component';
import { AnalysisRoutingModule } from './analysis-routing.module';

@NgModule({
  declarations: [
    SecondaryHeaderComponent,
    AnalysisComponent
  ],
  imports: [
    CommonModule,
    AnalysisRoutingModule
  ]
})
export class AnalysisModule { }
