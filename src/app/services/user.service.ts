import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserModel } from '../models/user.model';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private historySubject = new BehaviorSubject<UserModel[]>([]);  
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  private historyLoaded=false;
  user$ = this.userSubject.asObservable();
  history$ = this.historySubject.asObservable();  

  constructor(private clientService:ClientService) { }

  setUser(user: UserModel): void {
    this.userSubject.next(user);
  }
  
  getUser(): UserModel | null {
    return this.userSubject.getValue();
  }

  loadHistory(id:number): void {
    if (this.historyLoaded) {
    
      return;
    }
    this.clientService.getHistory(id).subscribe(history => {
      
      this.historySubject.next(history);   
      this.historyLoaded=true;
    });
  }

 
}
