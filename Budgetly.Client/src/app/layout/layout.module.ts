import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { SlideMenuModule } from 'primeng/slidemenu';

@NgModule({
    declarations: [
        LayoutComponent,
        SidebarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SlideMenuModule
    ]
})
export class LayoutModule { }
