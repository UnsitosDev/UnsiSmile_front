import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-students-tooth',
  standalone: true,
  imports: [
    NgClass,
    NgIf

  ],
  templateUrl: './students-tooth.component.html',
  styleUrl: './students-tooth.component.css'
})
export class StudentsToothComponent {
  @Input() data: any;
  @Input() index: number = 0;
  @Output() toggleTooth = new EventEmitter<any>();
  @Output() setFace = new EventEmitter<any>();

}
