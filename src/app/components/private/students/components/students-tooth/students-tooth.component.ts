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
  styleUrl: './students-tooth.component.scss'
})
export class StudentsToothComponent {
  @Input() data: any;
  @Input() index: number = 0;
  @Input() color: string = "withe";
  @Output() toggleTooth = new EventEmitter<any>();
  @Output() setFace = new EventEmitter<any>();

  clicked(data: any, index:number, faceId:any){
    this.setFace.emit({ faceId: data.faces[index].id, index: index, data: data });
  }

}
