import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';//import { AuthserviceService } from '../../../core/services/authservice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../core/services/common.service';

import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  headerTitle: string = '';
  authService: AuthService = inject(AuthService)
  user: any;
  menuShow: boolean = false;
  constructor(private _route: Router, private commonService: CommonService,
    private elementRef: ElementRef, private sessionService: SessionService) {
    this.commonService.profileUpdated$.subscribe(() => {
      this.getCurrentUserId();
    });

    this.getCurrentUserId();
  }

  ngOnInit(): void {
    this.commonService.titleHeader.subscribe((res: string) => {
      if (res) this.headerTitle = res;
    })
  }

  getCurrentUserId() {
    this.sessionService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.user = res;
        this.commonService.setUser(res)
      },
      error: (err: Error) => { console.log(err) }
    });
  }


  // show menu
  showMenu() {
    this.menuShow = !this.menuShow;
    console.log(this.menuShow);
  }

  logout() {
    this.authService.logout();
  }
  isDropdownOpen = false; // Control dropdown visibility

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  resetPassword() {
    // Redirect to the reset password page
    this._route.navigate(['/reset-password']).then(success => {
      this.isDropdownOpen = false;
    }).catch(err => {
      console.log('Navigation failed:', err);
    });// Adjust the route as necessary
  }
  // <input type="file" (change)="onFileSelected($event)" accept=".csv" />
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];

      // Ensure it's a CSV file
      if (file.type === 'text/csv') {
        const reader = new FileReader();

        reader.onload = (e) => {
          const csvData = e.target?.result as string;
          this.parseCSV(csvData);
        };

        reader.readAsText(file);
      } else {
        alert('Please upload a valid CSV file.');
      }
    }
  }

  parseCSV(csvData: string): void {
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');

    const data = rows.slice(1).map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
      }, {} as Record<string, string>);
    });

    console.log(data); // Display parsed data in the console or process it as needed
  }
  editProfile() {
    this._route.navigate(['/edit-profile'])
    this.isDropdownOpen = false;
  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    // Check if the click target is outside the component
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }

}