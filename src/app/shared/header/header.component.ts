import { Component } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports:[
    RouterLinkActive
  ]
})
export class HeaderComponent {
  logo = '../../../assets/logo.png';
  showMenuLogin = true;
  constructor(
    private router: Router
  ) {
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
