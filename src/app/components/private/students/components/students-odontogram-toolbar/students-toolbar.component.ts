import { toothOptions, uiTooth } from './../../../../../models/shared/store';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICondition } from 'src/app/models/shared/odontogram';
import { Toolbar } from 'src/app/models/shared/tool-bar-options.model';

@Component({
  selector: 'app-students-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './students-toolbar.component.html',
  styleUrl: './students-toolbar.component.scss',
})
export class StudentsToolbarComponent {
  @Input() toolbar!: Toolbar ;
  @Output() handleAction = new EventEmitter<ICondition>();

  selectSymbol(symbol: ICondition) {
    this.handleAction.emit(symbol);
    console.log(symbol)
  }

}