import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new BehaviorSubject<any>(null);
  public notification$ = this.notificationSubject.asObservable();
  private apiUrl = environment.baseUrl;
  constructor() {
    
  }
  public initializeConnection(token: string): Observable<boolean> {
    return new Observable((observer) => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.apiUrl}/signalr/notificationsHub`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Custom retry logic here
            if (retryContext.previousRetryCount < 5) {
              return 1000 * (retryContext.previousRetryCount + 1);  // Backoff strategy
            }
            return null;  // Stop retrying after 5 attempts
          }
        })
        .build();
        

      this.hubConnection.start()
        .then(() => {
          console.log('SignalR connection started');
          this.registerOnServerEvents();
          this.addConnectionStatusHandlers();
          observer.next(true);
          observer.complete();
        })
        .catch(err => {
          console.error('Error while starting SignalR connection:', err);
          observer.error(err);
        });
    });
  }
  // Expose a method to start SignalR connection manually
  // public startConnection() {
  //   if (!this.hubConnection) {
  //     this.createConnection();
  //     this.registerOnServerEvents();
  //     this.startConnectionProcess();
  //   }
  // }

  private createConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5000/notificationsHub') 
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Custom retry logic here
        if (retryContext.previousRetryCount < 5) {
          return 1000 * (retryContext.previousRetryCount + 1);  // Backoff strategy
        }
        return null;  // Stop retrying after 5 attempts
      }
    })
    .build();
  
  }

  private registerOnServerEvents() {
    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log('Notification received:', message);
      this.notificationSubject.next(message);  // Send notification to subscribers
    });
  }

  private startConnectionProcess() {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this.addConnectionStatusHandlers();
      })
      .catch(err => {
        console.error('Error while starting SignalR connection:', err);
        this.retryConnection();
      });
  }

  private addConnectionStatusHandlers() {
    this.hubConnection.onclose((error) => {
      console.log('SignalR connection closed', error);
      this.retryConnection();
    });

    this.hubConnection.onreconnecting((error) => {
      console.log('SignalR attempting to reconnect:', error);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log('SignalR reconnected. Connection ID:', connectionId);
    });
  }

  private retryConnection() {
    setTimeout(() => {
      this.startConnectionProcess();
    }, 1000); // Retry after 1 second
  }
  public getNotifications() {
    return this.notificationSubject.asObservable();
  }
}
