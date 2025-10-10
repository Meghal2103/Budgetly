import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryHeaderComponent } from './secondary-header/secondary-header.component';
import { AnalysisComponent } from './analysis.component';



@NgModule({
  declarations: [
    SecondaryHeaderComponent,
    AnalysisComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AnalysisModule { }
