import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OdontogramComponent } from '../odontogram/odontogram.component';
import { OdontogramSimpleResponse } from './models/odontogram-list.model';
import { OdontogramListService } from './repository/odontogram-list.service';

@Component({
  selector: 'app-odontogram-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIcon, MatExpansionModule, OdontogramComponent],
  templateUrl: './odontogram-list.component.html',
  styleUrl: './odontogram-list.component.scss'
})
export class OdontogramListComponent implements OnInit {
  @Input({ required: true }) idPatientMedicalRecord!: number;
  @Input({ required: true }) patientUuid!: string;
  @Input({ required: true }) scope!: 'MEDICAL_RECORD' | 'PATIENT';
  
  odontograms: OdontogramSimpleResponse[] = [];
  displayedColumns: string[] = ['idOdontogram', 'creationDate', 'actions'];
  isLoading = false;

  constructor(private odontogramListService: OdontogramListService) {}

  ngOnInit(): void {
    this.loadOdontograms();
  }

  private loadOdontograms(): void {
    this.isLoading = true;
        this.odontogramListService.getOdontogramsByPatientUuid(this.patientUuid)
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
