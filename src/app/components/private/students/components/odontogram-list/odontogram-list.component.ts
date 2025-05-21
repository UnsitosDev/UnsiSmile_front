import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StudentsOdontogramComponent } from '@mean/students';
import { OdontogramTreatment } from './models/odontogram-list.model';
import { OdontogramListService } from './repository/odontogram-list.service';

@Component({
  selector: 'app-odontogram-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIcon, MatExpansionModule, StudentsOdontogramComponent],
  templateUrl: './odontogram-list.component.html',
  styleUrl: './odontogram-list.component.scss'
})
export class OdontogramListComponent implements OnInit {
  @Input({ required: true }) treatmentId!: number;
  @Input({ required: true }) patientUuid!: string;
  
  odontograms: OdontogramTreatment[] = [];
  displayedColumns: string[] = ['idOdontogram', 'creationDate', 'actions'];
  isLoading = false;

  constructor(private odontogramListService: OdontogramListService) {}

  ngOnInit(): void {
    this.loadOdontograms();
  }

  private loadOdontograms(): void {
    this.isLoading = true;
    this.odontogramListService.getOdontogramsByTreatmentId(this.treatmentId)
      .subscribe({
        next: (response) => {
          this.odontograms = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading odontograms:', error);
          this.isLoading = false;
        }
      });
  }
}
