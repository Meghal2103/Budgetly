import { Component, inject } from '@angular/core';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    public sidebarService: SidebarService = inject(SidebarService);
}