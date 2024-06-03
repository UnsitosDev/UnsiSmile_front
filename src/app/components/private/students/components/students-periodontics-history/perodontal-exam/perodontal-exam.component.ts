import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-perodontal-exam',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './perodontal-exam.component.html',
  styleUrl: './perodontal-exam.component.scss'
})
export class PerodontalExamComponent {

}
