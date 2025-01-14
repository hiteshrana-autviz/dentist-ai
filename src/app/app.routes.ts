import { Routes } from '@angular/router';
import { authGuard } from './core/gaurds/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { loginGuard } from './core/gaurds/login.guard';

export const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  
  {
    path: 'account',
    canActivate: [loginGuard],
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'pages',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },

];
