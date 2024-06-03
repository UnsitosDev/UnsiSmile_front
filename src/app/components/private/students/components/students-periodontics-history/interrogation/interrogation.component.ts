import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-interrogation',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule],
  templateUrl: './interrogation.component.html',
  styleUrl: './interrogation.component.scss'
})
export class InterrogationComponent {

}
