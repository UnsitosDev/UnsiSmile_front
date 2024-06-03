import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-family-history',
  standalone: true,
  imports: [MatButtonModule,MatCheckboxModule],
  templateUrl: './family-history.component.html',
  styleUrl: './family-history.component.scss'
})
export class FamilyHistoryComponent {

}
