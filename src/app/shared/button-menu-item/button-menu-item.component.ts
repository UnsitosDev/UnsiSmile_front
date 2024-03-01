import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-menu-item',
  standalone: true,
  imports: [],
  templateUrl: './button-menu-item.component.html',
  styleUrl: './button-menu-item.component.css'
})

export class ButtonMenuItemComponent {
  @Input() iconClass: string = '';
  @Input() text: string = '';
}