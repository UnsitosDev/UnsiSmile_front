import { MedicalRecord } from 'src/app/models/history-clinic/medical-record.models';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SideNavComponent } from '@mean/shared';
import { MedicalRecordDigitizerItems } from '@mean/models';

@Component({
  selector: 'app-layout-medical-record-digitizer',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, HeaderComponent],
  templateUrl: './layout-medical-record-digitizer.component.html',
  styleUrl: './layout-medical-record-digitizer.component.scss'
})
export class LayoutMedicalRecordDigitizerComponent implements OnInit {
  isSidebarOpen = false;
  readonly userLink = '/medical-record-digitizer/user';
  readonly medicalRecordDigitizerItems = MedicalRecordDigitizerItems;

  ngOnInit() {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  onSidebarToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
