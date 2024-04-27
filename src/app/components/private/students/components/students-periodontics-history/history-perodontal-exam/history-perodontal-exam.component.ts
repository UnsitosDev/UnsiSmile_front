import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-history-perodontal-exam',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './history-perodontal-exam.component.html',
  styleUrl: './history-perodontal-exam.component.scss'
})
export class HistoryPerodontalExamComponent {

}
