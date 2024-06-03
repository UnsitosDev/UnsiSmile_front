import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-current-condition',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    NgIf,
    MatButtonModule],
  templateUrl: './current-condition.component.html',
  styleUrl: './current-condition.component.scss'
})
export class CurrentConditionComponent {

}
