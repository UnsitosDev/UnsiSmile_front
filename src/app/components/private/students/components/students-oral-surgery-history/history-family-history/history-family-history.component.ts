import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-history-family-history',
  standalone: true,
  imports: [MatButtonModule,MatCheckboxModule],
  templateUrl: './history-family-history.component.html',
  styleUrl: './history-family-history.component.scss'
})
export class HistoryFamilyHistoryComponent {

}
