import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-pathological-personal-history',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule],
  templateUrl: './pathological-personal-history.component.html',
  styleUrl: './pathological-personal-history.component.scss'
})
export class PathologicalPersonalHistoryComponent {

}
