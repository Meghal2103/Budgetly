import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarItem } from '../models/sidebar.model';
import { SIDEBAR_ITEMS } from '../config/sidebar.config';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public readonly sidebarItems: SidebarItem[] = SIDEBAR_ITEMS;
  private router: Router = inject(Router);
  private _activeIndex = 0;

  public navigate(item: SidebarItem): void {
    this.router.navigateByUrl(item.route);
  }

  public activeIndex(): number {
    return this._activeIndex;
  }

  public activateElement(sidebarItems: SidebarItem): void {
    this._activeIndex = this.sidebarItems.findIndex(item => item.id === sidebarItems.id);
  }
}
