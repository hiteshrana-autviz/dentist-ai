export interface MenuItem {
    id: number;              // Unique identifier for the menu item
    label: string;           // Display text for the menu item
    route: string;           // Route path for navigation
    img?: string;            // Optional image URL for the menu item
    permissionName?: string; // Optional permission name for access control
    children?: MenuItem[];   // Optional array of child menu items
    isActive?: boolean;      // Indicates if the menu item is active
    isCollapsed?: boolean;   // Indicates if the menu item is collapsed
    parentId?: number;   
        // ID of the parent menu item (if any)
  }