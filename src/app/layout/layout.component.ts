import { Component } from '@angular/core';
import { SidebarComponent } from './siderbar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,  // Import standalone component here
    HeaderComponent,   // Import standalone component here
    FooterComponent,
    RouterModule
    
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
