import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faFileMedical, faInfoCircle, faCalendarDay, faCalendarCheck, faChevronDown, faCheck } from '@fortawesome/free-solid-svg-icons';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string; // FontAwesome icon class (e.g., 'fas fa-calendar', 'far fa-user')
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent implements OnInit, OnDestroy {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Seleccionar...';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() label?: string;
  @Input() error?: string;
  @Input() required: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Output() valueChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<SelectOption>();

  // FontAwesome icons
  faChevronDown = faChevronDown;
  faCheck = faCheck;

  isOpen = false;
  selectedOption?: SelectOption;

  ngOnInit(): void {
    this.updateSelectedOption();
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select')) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.handleArrowDown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.handleArrowUp();
        break;
    }
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectOption(option: SelectOption): void {
    if (this.disabled || option.disabled) return;
    
    this.value = option.value;
    this.selectedOption = option;
    this.valueChange.emit(option.value);
    this.selectionChange.emit(option);
    this.closeDropdown();
  }

  private updateSelectedOption(): void {
    this.selectedOption = this.options.find(option => option.value === this.value);
  }

  private handleArrowDown(): void {
    if (!this.isOpen) {
      this.toggleDropdown();
      return;
    }

    const enabledOptions = this.options.filter(option => !option.disabled);
    const currentIndex = enabledOptions.findIndex(option => option.value === this.value);
    const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
    this.selectOption(enabledOptions[nextIndex]);
  }

  private handleArrowUp(): void {
    if (!this.isOpen) {
      this.toggleDropdown();
      return;
    }

    const enabledOptions = this.options.filter(option => !option.disabled);
    const currentIndex = enabledOptions.findIndex(option => option.value === this.value);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
    this.selectOption(enabledOptions[prevIndex]);
  }

  getDisplayText(): string {
    if (this.selectedOption) {
      return this.selectedOption.label;
    }
    return this.placeholder;
  }

  getSizeClass(): string {
    return `size-${this.size}`;
  }

  trackByValue(index: number, option: SelectOption): string {
    return option.value;
  }

  // Método para obtener el icono FontAwesome basado en la clase CSS
  getFontAwesomeIcon(iconClass?: string): any {
    if (!iconClass) return null;
    
    switch (iconClass) {
      case 'fas fa-calendar':
        return faCalendar;
      case 'fas fa-file-medical':
        return faFileMedical;
      case 'fas fa-info-circle':
        return faInfoCircle;
      case 'fas fa-calendar-day':
        return faCalendarDay;
      case 'fas fa-calendar-check':
        return faCalendarCheck;
      default:
        return null;
    }
  }
} 