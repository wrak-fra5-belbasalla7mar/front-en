import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { LiftSidebarComponent } from './components/lift-sidebar/lift-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [LiftSidebarComponent, RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 
export class AppComponent {
  title = 'company-managment';

  constructor(private router: Router) {}

  isAuthPage(): boolean {
    const authPages = ['/signin']; 
    return authPages.includes(this.router.url);
  }
}
