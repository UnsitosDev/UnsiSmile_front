import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-button-menu-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './button-menu-item.component.html',
  styleUrl: './button-menu-item.component.scss'
})

export class ButtonMenuItemComponent {
  @Input() buttonText: string = '';
  @Input() description: string = '';
  @Input() fontAwesomeIcon: any = faUser;
  @Input() link: string='/studets/dashboard';

  @Output() itemClicked = new EventEmitter<string>();

  onButtonClick() {
    this.itemClicked.emit(this.link); 
  }
}