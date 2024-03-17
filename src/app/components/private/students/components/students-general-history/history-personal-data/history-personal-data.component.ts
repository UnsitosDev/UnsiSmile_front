import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { NgFor } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-history-personal-data',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule 
  ],
  templateUrl: './history-personal-data.component.html',
  styleUrl: './history-personal-data.component.scss'
})
export class HistoryPersonalDataComponent {



}
