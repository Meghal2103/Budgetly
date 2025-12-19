import { inject, Injectable } from '@angular/core';
import { SidebarItem } from '../models/sidebar.model';
import { SIDEBAR_ITEMS } from '../config/sidebar.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public readonly sidebarItems: SidebarItem[] = SIDEBAR_ITEMS;
  private router: Router = inject(Router);
  private _activeItem: string = this.sidebarItems[0].id;

  public get activeItem(){
    return this._activeItem;
  }

  public navigate(item: SidebarItem): void {
    this._activeItem = item.id;
    this.router.navigateByUrl(item.route);
  }
}
