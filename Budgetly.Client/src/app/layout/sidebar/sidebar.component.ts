import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    private router: Router = inject(Router);
    private destroy$ = new Subject<void>();
    public sidebarService: SidebarService = inject(SidebarService);
    public activeItem: number = this.sidebarService.activeItem;

    private ngOnInit(): void {
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.activeItem = this.sidebarService.activeItem;
        });
    }

    private ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}