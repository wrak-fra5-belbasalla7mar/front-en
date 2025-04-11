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
  
  user$ = this.userSubject.asObservable();
  history$ = this.historySubject.asObservable();  

  constructor(private clientService:ClientService) { }

  setUser(user: UserModel): void {
    this.userSubject.next(user);
  }


  loadHistory(id:number): void {
    this.clientService.getHistory(id).subscribe(history => {
      alert('History loaded successfully!');
      alert(history);
      this.historySubject.next(history);   
    });
  }

 
}
