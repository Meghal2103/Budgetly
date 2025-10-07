import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryHeaderComponent } from './components/primary-header/primary-header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
    declarations: [
        PrimaryHeaderComponent,
        PageNotFoundComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        PrimaryHeaderComponent
    ]
})
export class SharedModule { }
