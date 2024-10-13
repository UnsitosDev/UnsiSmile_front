import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-dialog-personal-data',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dialog-personal-data.component.html',
  styleUrl: './dialog-personal-data.component.scss'
})
export class DialogPersonalDataComponent {
  data = inject(DIALOG_DATA);

}
