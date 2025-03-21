import { Component, Input, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-menu-assess-medical-history',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './menu-assess-medical-history.component.html',
  styleUrl: './menu-assess-medical-history.component.scss'
})
export class MenuAssessMedicalHistoryComponent {
  @Input() idClinicalHistoryPatient!: number;
  @Input() selectedIndex: number | null = null; 

  updateStatusHc(){
    console.log('idClinicalHistoryPatient:', this.idClinicalHistoryPatient);
    console.log('selectedIndex:', this.selectedIndex);
  }
}
