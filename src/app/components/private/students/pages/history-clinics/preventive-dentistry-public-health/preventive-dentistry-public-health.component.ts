import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { TabViewModule } from 'primeng/tabview';
import { MatInputModule } from '@angular/material/input';

// Componentes
import { CardPatientDataComponent } from "../../../components/card-patient-data/card-patient-data.component";
import { TabFormComponent } from 'src/app/shared/components/tab-form/tab-form.component';
import { StudentsOdontogramComponent } from '../../../components/odontogram/students-odontogram.component';
import { HistoryInitialBagComponent } from "../../../components/form-history-initial-bag/history-initial-bag.component";

// Servicios
import { ApiService } from '@mean/services';
import { GeneralHistoryService } from 'src/app/services/history-clinics/general/general-history.service';

// Modelos
import { Patient } from 'src/app/models/shared/patients/patient/patient';
import { dataTabs } from 'src/app/models/form-fields/form-field.interface';
import { UriConstants } from '@mean/utils';
import { cardGuardian, cardPatient } from 'src/app/models/shared/patients/cardPatient';
import { TabFormUpdateComponent } from "../../../../../../shared/components/tab-form-update/tab-form-update.component";
import { Subscription } from 'rxjs';
import { StatusClinicalHistoryResponse, StudentItems } from '@mean/models';
import { DialogConfirmLeaveComponent } from '../../../components/dialog-confirm-leave/dialog-confirm-leave.component';
import { Messages } from 'src/app/utils/messageConfirmLeave';
import { HttpHeaders } from '@angular/common/http';
import { DialogConfirmSendToReviewComponent } from '../../../components/dialog-confirm-send-to-review/dialog-confirm-send-to-review.component';

@Component({
  selector: 'app-preventive-dentistry-public-health',
  standalone: true,
  imports: [MatInputModule, TabFormComponent, MatTabsModule, MatDialogModule, MatTabsModule, MatDialogModule, MatCardModule, MatButtonModule, CardPatientDataComponent, TabViewModule, TabFormUpdateComponent],
  templateUrl: './preventive-dentistry-public-health.component.html',
  styleUrl: './preventive-dentistry-public-health.component.scss'
})
export class PreventiveDentistryPublicHealthComponent {
  private router = inject(ActivatedRoute);
  private route = inject(Router);
  private historyData = inject(GeneralHistoryService);
  private patientService = inject(ApiService<Patient, {}>);
  private apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);
  private id!: number;
  private idpatient!: string;
  private idPatientClinicalHistory!: number;
  private year?: number;
  private month?: number;
  private day?: number;
  private nextpage: boolean = true;
  private patient!: Patient;
  public patientData!: cardPatient;
  public guardianData: cardGuardian | null = null;
  public currentIndex: number = 0; // Índice del tab activo
  public mappedHistoryData!: dataTabs;
  // Variables para navegación
  private navigationSubscription!: Subscription;
  private navigationTarget: string = ''; // Ruta de navegación cancelada
  private navigationInProgress: boolean = false; // Variable para controlar la navegación
  private isNavigationPrevented: boolean = true; // Variable para evitar navegación inicialmente
  private navigationComplete: boolean = false; // Flag para manejar la navegación completada
  private additionalRoutes = ['/students/user'];

  constructor() { }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.id = params['id']; // Id Historia Clinica
      this.idpatient = params['patient']; // Id Paciente
      this.idPatientClinicalHistory = params['patientID']; // idPatientClinicalHistory
      this.historyData.getHistoryClinics(this.idpatient, this.id).subscribe({
        next: (mappedData: dataTabs) => {
          this.mappedHistoryData = mappedData;
        }
      });
      this.fetchPatientData();
    });

    // Combina las rutas de StudentItems y las adicionales
    const allRoutes = [
      ...StudentItems.map(item => item.routerlink),
      ...this.additionalRoutes
    ];

    // Interceptamos la navegación antes de que se realice
    this.navigationSubscription = this.route.events.subscribe((event) => {
      if (event instanceof NavigationStart && !this.navigationInProgress && !this.navigationComplete) {
        const targetUrl = event.url;

        // Verifica si la ruta es una de las que queremos prevenir
        if (allRoutes.includes(targetUrl)) {
          this.navigationTarget = targetUrl;

          // Detiene la navegación y mostramos el diálogo
          this.openDialog('300ms', '200ms', Messages.CONFIRM_LEAVE_HC_PREVENTIVE);
        }
      }
    });
    this.getStatusHc();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, message: string): void {
    // Inicialmente, mantenemos al usuario en la misma página si no se ha aceptado la navegación
    if (this.isNavigationPrevented) {
      // Mantiene al usuario en el componente StudentsGeneralHistoryComponent
      this.route.navigateByUrl(this.route.url);
    }

    const dialogRef = this.dialog.open(DialogConfirmLeaveComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { message }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.navigationInProgress = false; // Restablecemos la variable cuando el diálogo se cierra
      if (result) {
        // Desactivamos la prevención de la navegación después de aceptar
        this.isNavigationPrevented = false;
        // Marca que la navegación se completó
        this.navigationComplete = true;
        setTimeout(() => {
          this.route.navigateByUrl(this.navigationTarget); // Navegar a la ruta almacenada
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  fetchPatientData(): void {
    if (this.idpatient) {
      this.patientService.getService({
        url: `${UriConstants.GET_PATIENTS}/${this.idpatient}`,
      }).subscribe({
        next: (data) => {
          this.patient = data;
          const { person, address, admissionDate } = data;
          const { firstName, secondName, firstLastName, secondLastName, gender, birthDate, phone, email, curp } = person;
          // Formatear la fecha de nacimiento
          const formattedBirthDate = this.formatDate(birthDate);
          // Asignar año, mes y día
          const birthDateObj = new Date(birthDate);
          this.year = birthDateObj.getFullYear();
          this.month = birthDateObj.getMonth() + 1; // getMonth() devuelve el mes (0-11), sumamos 1 para obtener el mes (1-12)
          this.day = birthDateObj.getDate();
          // Crear un resumen del paciente
          this.patientData = {
            fullName: this.getFullName(firstName, secondName, firstLastName, secondLastName),
            gender: gender.gender,
            birthDate: formattedBirthDate,
            phone: phone,
            address: this.formatAddress(address),
            email: email,
            admissionDate: this.formatDate(admissionDate),
            curp: curp
          };
          if (this.patient.guardian) {
            this.guardianData = {
              firstName: this.patient.guardian.firstName,
              lastName: this.patient.guardian.lastName,
              email: this.patient.guardian.email,
              phone: this.patient.guardian.phone,
              parentalStatus: this.patient.guardian.parentalStatus ? {
                idCatalogOption: this.patient.guardian.parentalStatus.idCatalogOption,
                optionName: this.patient.guardian.parentalStatus.optionName
              } : { idCatalogOption: 0, optionName: '' },
              doctorName: this.patient.guardian.doctorName || ''
            };
          } else {
            this.guardianData = null;
          }
        },
        error: (error) => {
          console.error('Error fetching patient data:', error);
        },
      });
    }
  }

  // Método auxiliar para obtener el nombre completo
  private getFullName(firstName: string, secondName: string, firstLastName: string, secondLastName: string): string {
    return `${firstName} ${secondName} ${firstLastName} ${secondLastName}`.trim();
  }

  // Método auxiliar para formatear la dirección
  private formatAddress(address: any): string {
    const { street } = address;
    return `${street.name} , ${street.neighborhood.name}, ${street.neighborhood.locality.name}, ${street.neighborhood.locality.municipality.name}, ${street.neighborhood.locality.municipality.state.name}`;
  }

  // Método para formatear fecha
  formatDate(dateArray: number[]): string {
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  }

  status: StatusClinicalHistoryResponse | null = null;

  statusMap: { [key: string]: string } = {
    IN_REVIEW: 'EN REVISIÓN <i class="fas fa-spinner"></i>',
    APPROVED: 'APROBADO <i class="fas fa-check-circle"></i>',
    REJECTED: 'RECHAZADO <i class="fas fa-times-circle"></i>',
  };

  getStatusHc() {
    this.apiService
      .getService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.GET_CLINICAL_HISTORY_STATUS}/${this.idPatientClinicalHistory}`,
        data: {},
      })
      .subscribe({
        next: (response) => {
          this.status = response; // Asigna la respuesta a `status`
        },
        error: () => {

        },
      });
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(DialogConfirmSendToReviewComponent, {
      width: '300px',
      data: { idPatientClinicalHistory: this.idPatientClinicalHistory }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStatusHc();
      }
    });
  }


  translateStatus(status: string): string {
    return this.statusMap[status] || status; 
  }

  onNextTab(): void {
    this.currentIndex++; // Incrementar el índice del tab activo
    if (this.currentIndex >= this.mappedHistoryData.tabs.length) {
      this.currentIndex = this.mappedHistoryData.tabs.length - 1; // Limitar el índice si excede la cantidad de tabs
    }
  }

  onPreviousTab(): void {
    this.currentIndex--; // Decrementar el índice del tab activo
    if (this.currentIndex < 0) {
      this.currentIndex = 0; // Limitar el índice si es menor que cero
    }
  }
}
