import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

import { CommonModule } from '@angular/common';
import { CommonService } from '../../core/services/common.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MenuItem } from '../../interfaces/menu-item';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  activatedMenuItems: MenuItem[] = [];
  menuItemsMap: { [key: number]: MenuItem } = {};
  isCollapsed: boolean = false;
  isUniversityAdmin: boolean = false; // Assuming this is from a user role check
  userDetails: any = {};
  innerWidth: any;

  constructor(
    private router: Router,
    private _cdr: ChangeDetectorRef,
    private commonService: CommonService,
    private authService: AuthService
  ) {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEvent(event);
      }
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.updateActiveMenuItem();
        });
    });
  }

  private openSubmenuItem: MenuItem | null = null;

  // Modify the toggleSubmenu method
  toggleSubmenu(selectedItem: MenuItem, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // If clicking the same item that's already open, just toggle it
    if (this.openSubmenuItem === selectedItem) {
      selectedItem.isCollapsed = !selectedItem.isCollapsed;
      this.openSubmenuItem = selectedItem.isCollapsed ? null : selectedItem;
    } else {
      // If there's a different menu open, close it
      if (this.openSubmenuItem) {
        this.openSubmenuItem.isCollapsed = true;
      }
      // Open the new selected menu
      selectedItem.isCollapsed = false;
      this.openSubmenuItem = selectedItem;
    }

    this._cdr.detectChanges();
  }
  handleMenuClick(item: MenuItem) {
    // If clicking a menu item without children, close any open submenu
    if (!item.children && this.openSubmenuItem) {
      this.openSubmenuItem.isCollapsed = true;
      this.openSubmenuItem = null;
      this._cdr.detectChanges();
    }
  }
  // Add this to initialize all menu items as collapsed
  ngOnInit(): void {
    this.menuItems.forEach((item) => {
      if (item.children) {
        item.isCollapsed = true;
      }
    });
  }

  // Also
  handleNavigationEvent(event: NavigationEnd) {
    if (event.url === '/' && event.urlAfterRedirects === '/') {
      this.router.navigate(['/home']);
    }
  }

  getMenuItems(): MenuItem[] {
    return [
      {
        label: 'Home',
        route: '/home',
        permissionName: '',
        img: '/assets/icons/sidebar-icons/home.svg',
        id: 0,
        isActive: false,
      },
      {
        label: 'Process XRays',
        route: '/xray',
        permissionName: '',
        img: '/assets/icons/sidebar-icons/xray.svg',
        id: 0,
        isActive: false,
      },
      {
        label: 'Product Feature',
        route: '/product-feature',
        permissionName: '',
        img: '/assets/icons/sidebar-icons/product.svg',
        id: 0,
        isActive: false,
      },
      {
        label: 'Sample Images',
        route: '/sample-images',
        permissionName: '',
        img: '/assets/icons/sidebar-icons/gallery.svg',
        id: 0,
        isActive: false,
      },

      // {
      //   label: 'Coupons History',
      //   route: '/coupon-history',
      //   permissionName: '',
      //   img: 'fa-solid fa-clock',
      //   id: 0,
      //   isActive: false,
      //   children: [
      //     {
      //       label: 'Coupons Settings',
      //       route: '/coupon-settings',
      //       permissionName: '',
      //       img: 'fa-solid fa-gears',
      //       id: 0,
      //       isActive: false,
      //     }
      //   ]
      // },
    ];
  }

  updateActiveMenuItem() {
    const currentRoute = this.router.url;
    this.menuItems.forEach((item) => {
      item.isActive = currentRoute.startsWith(item.route);
      if (item.children) {
        item.children.forEach((child) => {
          child.isActive = currentRoute.startsWith(child.route);
        });
      }
    });
  }
  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
    this._cdr.detectChanges();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSidebarOnMobileView() {
    if (this.innerWidth <= 991) this.isCollapsed = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 991) this.isCollapsed = true;
    else this.isCollapsed = false;
  }
  logout() {
    this.authService.logout();
  }
}
