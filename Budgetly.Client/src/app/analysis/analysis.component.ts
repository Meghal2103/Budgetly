import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { SidebarService } from '../core/services/sidebar.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-analysis',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
    private sidebarService: SidebarService = inject(SidebarService);
    private router: Router = inject(Router);
    private cdn: ChangeDetectorRef = inject(ChangeDetectorRef);
    private destroy$ = new Subject<void>();
    public activeItem: number = this.sidebarService.activeItem;

    ngOnInit(): void {
        this.router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.activeItem = this.sidebarService.activeItem;
            this.cdn.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
