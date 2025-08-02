import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { BaseNavigationComponent } from 'src/app/core/base/base-navigation.component';
import { StatusService } from 'src/app/shared';
import { CustomSelectComponent, SelectOption } from 'src/app/shared/components/custom-select/custom-select.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { MedicalRecordHistory, MedicalRecordHistoryResponse } from './models/medical-record-history.model';
import { MedicalRecordHistoryRepository } from './repositories/medical-record-history.repository';
@Component({
  selector: 'app-medical-record-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatListModule, 
    MatCardModule, 
    MatChipsModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    LoadingComponent,
    CustomSelectComponent,
    FontAwesomeModule
  ],
  templateUrl: './medical-record-list.component.html',
  styleUrl: './medical-record-list.component.scss'
})
export class MedicalRecordListComponent extends BaseNavigationComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() idPatient: string = '';
  @ViewChild('loadingTrigger', { static: false }) loadingTrigger!: ElementRef;

  medicalRecords: MedicalRecordHistory[] = [];
  patientName: string = '';
  patientMedicalRecordNumber: number | null = null;
  loading = true;
  loadingMore = false;
  error: string | null = null;
  hasMoreData = true;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;

  // Ordenamiento
  selectedOrder = 'appointmentDate';
  isAscending = false;

  sortOptions: SelectOption[] = [
    { value: 'appointmentDate', label: 'Fecha de Inicio de tratamiento', icon: 'fas fa-calendar' },
    { value: 'medicalRecordCatalog.medicalRecordName', label: 'Nombre de Historia Clínica', icon: 'fas fa-file-medical' }
  ];

  private destroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;

  private repo = inject(MedicalRecordHistoryRepository);
  private dateAdapter = inject(DateAdapter<Date>);
  public statusService = inject(StatusService);

  constructor() {
    super();
  }



  ngOnInit(): void {
    if (this.idPatient) {
      this.loadInitialData();
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private loadInitialData(): void {
    this.loading = true;
    this.error = null;
    this.currentPage = 0;
    this.medicalRecords = [];
    this.hasMoreData = true;

    this.repo.getMedicalRecordsByPatientId(
      this.idPatient, 
      this.currentPage, 
      this.pageSize,
      this.selectedOrder,
      this.isAscending
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MedicalRecordHistoryResponse) => {
          this.patientName = response.patient.name;
          this.patientMedicalRecordNumber = response.patient.medicalRecordNumber;
          this.medicalRecords = response.page.content;
          this.totalElements = response.page.totalElements;
          this.hasMoreData = !response.page.last;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el historial';
          this.loading = false;
        }
      });
  }

  private loadMoreData(): void {
    if (this.loadingMore || !this.hasMoreData) return;

    this.loadingMore = true;
    this.currentPage++;

    this.repo.getMedicalRecordsByPatientId(
      this.idPatient, 
      this.currentPage, 
      this.pageSize,
      this.selectedOrder,
      this.isAscending
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MedicalRecordHistoryResponse) => {
          this.medicalRecords = [...this.medicalRecords, ...response.page.content];
          this.hasMoreData = !response.page.last;
          this.loadingMore = false;
        },
        error: (err) => {
          this.error = 'Error al cargar más registros';
          this.loadingMore = false;
          this.currentPage--; // Revertir la página en caso de error
        }
      });
  }

  private setupIntersectionObserver(): void {
    if (!this.loadingTrigger) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && this.hasMoreData && !this.loadingMore) {
            this.loadMoreData();
          }
        });
      },
      {
        rootMargin: '100px', // Cargar cuando esté a 100px del final
        threshold: 0.1
      }
    );

    this.intersectionObserver.observe(this.loadingTrigger.nativeElement);
  }

  onSortChange(): void {
    // Resetear paginación y recargar datos con nuevo orden
    this.currentPage = 0;
    this.medicalRecords = [];
    this.hasMoreData = true;
    this.loadInitialData();
  }

  onOrderDirectionChange(): void {
    this.onSortChange();
  }

  retryLoad(): void {
    this.loadInitialData();
  }

  getStatusColor(status: string | undefined): string {
    if (!status) return 'basic';
    return this.statusService.getStatusColor(status);
  }

  trackByRecordId(index: number, record: MedicalRecordHistory): number {
    return record.patientMedicalRecordId || index;
  }

  formatDate(dateValue: string | Date): string {
    if (!dateValue) return 'Sin fecha';
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return this.dateAdapter.format(date, 'dd/MM/yyyy');
  }
}
