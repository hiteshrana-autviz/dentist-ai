import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountModule } from './account/account.module';
import { SignalRService } from './core/services/signalR.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AccountModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [SignalRService]
})
export class AppComponent {
  title = 'dentistAi-ui';
  constructor(private signalRService: SignalRService,
    private authService: AuthService) {
 
   }  

  ngOnInit() {
    const authToken = this.authService.getTokenFromCookie();
    // Start SignalR connection when the app component is loaded
    if(authToken)
      this.signalRService.initializeConnection(authToken).subscribe({
        next: (connected) => {
          if (connected) {
            console.log('SignalR connection established');
          }
        },
        error: (err) => {
          console.error('Error establishing SignalR connection:', err);
        }
      });
    }


  }
  

