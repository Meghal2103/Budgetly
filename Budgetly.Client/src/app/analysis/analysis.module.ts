import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecondaryHeaderComponent } from './secondary-header/secondary-header.component';
import { AnalysisComponent } from './analysis.component';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    SecondaryHeaderComponent,
    AnalysisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AnalysisRoutingModule,
    ChartModule,
    DropdownModule,
    CalendarModule
  ]
})
export class AnalysisModule { }
