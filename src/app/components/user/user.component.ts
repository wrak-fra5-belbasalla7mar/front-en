import { Component } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { Location } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  user!:UserModel;
  history:UserModel[] = [];
  constructor(private userService:UserService) {  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
     this.user = user!;
    });
    this.userService.loadHistory(this.user.id!);
    this.userService.history$.subscribe(history => {
      this.history = history;
    });
  }
}
