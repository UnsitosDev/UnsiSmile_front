import { Component, Input } from '@angular/core';
import { OralProsthesisComponent } from '../oral-prosthesis/oral-prosthesis.component';
import { StudentsPeriodonticsHistoryComponent } from '../periodontics/students-periodontics-history.component';
import { StudentsDentalOperationComponent } from '../dental-operation/students-dental-operation.component';
import { StudentsOralSurgeryHistoryComponent } from '../oral-surgery/students-oral-surgery-history.component';
import { PreventiveDentistryPublicHealthComponent } from '../preventive-dentistry-public-health/preventive-dentistry-public-health.component';
import { MEDICAL_RECORD_TYPES } from '@mean/models';

@Component({
  selector: 'app-medical-records-container',
  standalone: true,
  imports: [OralProsthesisComponent, StudentsPeriodonticsHistoryComponent, StudentsDentalOperationComponent, StudentsOralSurgeryHistoryComponent, PreventiveDentistryPublicHealthComponent, ],
  templateUrl: './medical-records-container.component.html',
  styleUrl: './medical-records-container.component.scss'
})
export class MedicalRecordsContainerComponent {
  @Input({required:true}) medicalRecordTypeId!: number;
  @Input({required:true}) patientId!: string;
  @Input({required:true}) readOnly!: boolean;
  public medicalRecordType = MEDICAL_RECORD_TYPES;
}
