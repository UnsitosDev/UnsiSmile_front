import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-history-exploration-oral',
  standalone: true,
  imports: [MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    NgFor,
    MatButtonModule],
  templateUrl: './history-exploration-oral.component.html',
  styleUrl: './history-exploration-oral.component.scss'
})
export class HistoryExplorationOralComponent {

}
