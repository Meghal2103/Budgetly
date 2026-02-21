import { Component } from '@angular/core';
import {SidebarComponent} from "./sidebar/sidebar.component";
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-layout',
    imports: [SidebarComponent, RouterModule],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    
}
