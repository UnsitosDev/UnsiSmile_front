import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-no-pathological-personal-history',
  standalone: true,
  imports: [
    MatCheckboxModule, MatButtonModule
  ],
  templateUrl: './no-pathological-personal-history.component.html',
  styleUrl: './no-pathological-personal-history.component.scss'
})
export class NoPathologicalPersonalHistoryComponent {

}
