import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { UserDto } from '../../interfaces/user-dto';
import { environment } from '../../environments/environment';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
 baseUrl = `${environment.baseUrl}/api/Session`;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Get the current user's details
  // getCurrentUser(): Observable<{ success: boolean; message: string; data: UserDto }> {
  //   return this.http.get<{ success: boolean; message: string; data: UserDto }>(
  //     `${this.baseUrl}/CurrentUser`
  //   );
  // }

  // getCurrentUser(): Observable<any> {
  //   return this.http.get(`${this.baseUrl}/CurrentUser`).pipe(
  //     catchError((error) => {
  //       console.error('Error occurred:', error);
  //       throw error;  // Rethrow the error or handle it accordingly
  //     })
  //   );
  // }
  getCurrentUser(): Observable<{ success: boolean; message: string; data: UserDto }> {
    return this.http.get<{ success: boolean; message: string; data: UserDto }>(
      `${this.baseUrl}/CurrentUser`
    );
  }
  // Get the current user's ID
  getCurrentUserId(): Observable<{ success: boolean; userId: string }> {
    return this.http.get<{ success: boolean; userId: string }>(`${this.baseUrl}/CurrentUserId`);
  }

  // Check if the user is authenticated
  isAuthenticated(): Observable<{ success: boolean; isAuthenticated: boolean }> {
    return this.http.get<{ success: boolean; isAuthenticated: boolean }>(
      `${this.baseUrl}/IsAuthenticated`
    );
  }

  // Get the roles of the current user
  getUserRoles(): Observable<{ success: boolean; roles: string[] }> {
    return this.http.get<{ success: boolean; roles: string[] }>(`${this.baseUrl}/UserRoles`);
  }
  clearSession(): void {
    this.currentUserSubject.next(null);
  }
}
