import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  headerTitle = new BehaviorSubject<string>('');
  titleHeader = this.headerTitle.asObservable();
  apiUrl = environment.baseUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // user session
  private currentUserSubject = new BehaviorSubject(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) {}

  private profileUpdatedSource = new Subject<void>();
  profileUpdated$ = this.profileUpdatedSource.asObservable();

  notifyProfileUpdated() {
    this.profileUpdatedSource.next();
  }

  setHeaderTitle(title: string){
    this.headerTitle.next(title);
  }

  showLoader() {
    this.loadingSubject.next(true);
  }
 
  hideLoader() {
    this.loadingSubject.next(false);
  }
  setUser(userId: any){
    this.currentUserSubject.next(userId);
  }
  uploadImage(data: any){
    return this.http.post(`${this.apiUrl}/authentication/upload`, data);
  }
  genParamsQuery(query: any){
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
        if (query[key] !== undefined && query[key] !== null) {
            params = params.set(key, query[key].toString());
        }
    });
    return params
  }
}
