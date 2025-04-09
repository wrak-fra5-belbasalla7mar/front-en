import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject=new BehaviorSubject<UserModel | null>(null);
  user$=this.userSubject.asObservable();
  setUser(user:UserModel){
    this.userSubject.next(user);
  }
  getUser():UserModel | null {
    return this.userSubject.getValue();
  }
  constructor() { }
}
