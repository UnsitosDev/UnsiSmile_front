import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-button-menu-item',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './button-menu-item.component.html',
  styleUrl: './button-menu-item.component.css'
})

export class ButtonMenuItemComponent {
  @Input() buttonText: string = '';
  @Input() description: string = '';
  @Input() fontAwesomeIcon: any = faUser;
}