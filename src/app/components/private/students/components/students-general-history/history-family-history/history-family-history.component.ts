import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-history-family-history',
  standalone: true,
  imports: [
    MatCheckboxModule
  ],
  templateUrl: './history-family-history.component.html',
  styleUrl: './history-family-history.component.scss'
})
export class HistoryFamilyHistoryComponent {

}
