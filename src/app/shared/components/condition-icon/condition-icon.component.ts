import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-condition-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (iconPath) {
      <img 
        [src]="iconPath" 
        (click)="onClick($event)"
        [class]="customClass"
        [style]="customStyle"
        [title]="showTitle ? title : ''"
        [alt]="condition"
        class="condition-icon"
      />
    }
  `,
  styles: [`
    .condition-icon {
      display: inline-block;
      vertical-align: middle;
      user-select: none;
    }
  `]
})
export class ConditionIconComponent {
  @Input() condition: string = '';
  @Input() customClass: string = '';
  @Input() customStyle: string = 'cursor: pointer;';
  @Input() showTitle: boolean = true;
  @Input() stopPropagation: boolean = true;
  @Output() iconClick = new EventEmitter<Event>();

  constructor(private iconService: IconService) {}

  get iconPath(): string | null {
    return this.iconService.getIconPath(this.condition);
  }

  get title(): string {
    return this.iconService.getIconTitle(this.condition);
  }

  onClick(event: Event): void {
    if (this.stopPropagation) {
      event.stopPropagation();
    }
    this.iconClick.emit(event);
  }
}
