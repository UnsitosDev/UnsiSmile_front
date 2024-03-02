import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { faChartPie, faFileAlt, faCogs } from '@fortawesome/free-solid-svg-icons';
import { ButtonMenuItemComponent } from '../button-menu-item/button-menu-item.component';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    ButtonMenuItemComponent
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  @Input() isSidebarOpen = false;
  faFontAwesomeFlag = faChartPie;
  faFileAlt = faFileAlt;
  faCogs = faCogs;
}
