import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pathological-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './pathological-history.component.html',
  styleUrl: './pathological-history.component.scss'
})
export class PathologicalHistoryComponent {

}
