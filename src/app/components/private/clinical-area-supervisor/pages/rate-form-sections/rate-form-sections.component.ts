import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormSection, formSectionFields } from '@mean/models';
import { Subscription } from 'rxjs';
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { mapFormSectionToFormSectionFields } from '../../../students/adapters/clinical-history.adapters';
import { DialogSendReview } from '../../components/menu-assess-medical-redord/menu-assess-medical-record.component';
import { RateFormSectionService } from './services/rate-form-section.service';

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
  readonly dialog = inject(MatDialog);

  public formSectionId!: string;
  public patientMedicalRecordId!: number;
  public formSection!: FormSection;
  public formSectionMapped!: formSectionFields;
  public isLoading: boolean = true;
  public patientUUID: string = '';
  public reviewStatusId: number = 0;

  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.params.subscribe({
        next: (params) => {
          this.formSectionId = params['formSectionId'];
          this.patientMedicalRecordId = parseInt(
            params['patientMedicalRecordId'],
            10
          );
          this.patientUUID = params['patientId'];
          this.reviewStatusId = parseInt(params['idReviewStatus'], 10);
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

  opedDialogRateFormSections() {
    const dialogRef = this.dialog.open(DialogSendReview, {
      data: {
      idReviewStatus: this.reviewStatusId, 
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  
}
