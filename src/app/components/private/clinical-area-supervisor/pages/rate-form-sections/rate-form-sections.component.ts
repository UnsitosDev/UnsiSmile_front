import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FieldComponentComponent } from 'src/app/shared/components/field-component/field-component.component';
import { RateFormSectionService } from './services/rate-form-section.service';
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { FormSection, formSectionFields } from '@mean/models';
import { mapFormSectionToFormSectionFields } from '../../../students/adapters/clinical-history.adapters';

@Component({
  selector: 'app-rate-form-sections',
  standalone: true,
  imports: [
    TabFormComponent
  ],
  templateUrl: './rate-form-sections.component.html',
  styleUrl: './rate-form-sections.component.scss',
})
export class RateFormSectionsComponent implements OnInit, OnDestroy {
  private rateService = inject(RateFormSectionService);
  private activatedRoute = inject(ActivatedRoute);
  private subscriptions = new Subscription();

  public formSectionId!: number;
  public patientMedicalRecordId!: number;
  public formSection!: FormSection;
  public formSectionMapped!: formSectionFields;
  public isLoading: boolean = true;
  public patientUUID: string = '';

  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe({
        next: (params) => {
          console.log('Route Params:', params);
          this.formSectionId = parseInt(params['formSectionId'], 10);
          this.patientMedicalRecordId = parseInt(
            params['patientMedicalRecordId'],
            10
          );
          this.patientUUID = params['patientId'];

          this.fetchFormSectionData();
        },
        error: (error) => {
          console.error('Error getting route params:', error);
        },
      })
    );
  }

  private fetchFormSectionData(): void {
    this.subscriptions.add(
      this.rateService
        .getFormSection(this.formSectionId, this.patientMedicalRecordId)
        .subscribe({
          next: (data: FormSection) => {
            console.log('Form Section Data:', data);

           this.formSectionMapped = mapFormSectionToFormSectionFields(data);
            

            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching form section:', error);
            this.isLoading = false;
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  
}
