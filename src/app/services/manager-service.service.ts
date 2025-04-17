import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { UserResponse } from '../models/user-response-model';
import { UserRequestModel } from '../models/user.request.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerServiceService {

  constructor(private clientService:ClientService) { }

  addUser(user: UserRequestModel) {
    return this.clientService.addUser(user);
  }
  updateUser(id: number, user: UserRequestModel) { 
    return this.clientService.updateUser(id, user);
  }
}
