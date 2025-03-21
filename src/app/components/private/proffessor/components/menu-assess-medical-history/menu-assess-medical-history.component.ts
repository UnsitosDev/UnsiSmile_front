import { Component, Input, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-menu-assess-medical-history',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './menu-assess-medical-history.component.html',
  styleUrl: './menu-assess-medical-history.component.scss'
})
export class MenuAssessMedicalHistoryComponent implements OnInit {
  @Input() idClinicalHistoryPatient!: number;
  @Input() selectedIndex!: number; 

  ngOnInit(): void {
    console.log('idClinicalHistoryPatient:', this.idClinicalHistoryPatient);
    console.log('selectedIndex:', this.selectedIndex);
  }
}
