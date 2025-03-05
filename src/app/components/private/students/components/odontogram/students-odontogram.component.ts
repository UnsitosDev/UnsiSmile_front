import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { StudentsToolbarComponent } from './../toolbar-odontogram/students-toolbar.component';
import { StudentsToothComponent } from './../tooth/students-tooth.component';

import { ApiService, OdontogramData, store } from '@mean/services';
import { Constants, ToothConditionsConstants } from '@mean/utils';

import { HttpHeaders } from '@angular/common/http';
import {
  ICondition,
  IFace,
  IOdontogram,
  IOdontogramHandler,
  ITooth,
  OdontogramPost,
  OdontogramResponse,
} from '@mean/models';
import { TabsHandler } from '@mean/shared';
import { mapOdontogramResponseToOdontogramData } from '@mean/students';
import { UriConstants } from '@mean/utils';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConditionsDialogComponent } from '../delete-conditions-dialog/delete-conditions-dialog.component';

interface ToothEvent {
  faceId: string;
  index: number;
  tooth: ITooth;
}

@Component({
  selector: 'app-students-odontogram',
  standalone: true,
  imports: [
    StudentsToothComponent,
    StudentsToolbarComponent,
    MatTabsModule,
    MatButtonModule,
  ],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent implements OnInit, TabsHandler {

  constructor(private dialog: MatDialog) {}


  private odontogramService = inject(ApiService<{}, OdontogramPost>);
  @Input({ required: true }) patientId!: string;
  @Input({ required: true }) idQuestion!: number;
  @Input({ required: true }) idClinicalHistoryPatient!: number;
  @Input({ required: true }) idFormSection!: number;
  @Input({ required: true }) state!: 'create' | 'update' | 'read' | 'read-latest';
  private toastr = inject(ToastrService);

  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior

  private readonly odontogramData = inject(OdontogramData);
  private readonly toothFaceConditions = new Set([
    ToothConditionsConstants.DIENTE_CARIADO,
    ToothConditionsConstants.DIENTE_OBTURADO,
    ToothConditionsConstants.DIENTE_CON_FRACTURA,
    ToothConditionsConstants.DIENTE_OBTURADO_CON_CARIES,
  ]);

  currentOdontogramId!: number;
  isEditing = false;
  renderOdontogram = false;

  data: IOdontogramHandler = store;
  odontogram: IOdontogram = { teeth: [] };
  options: ICondition[] = [];
  faces: IFace[] = [];
  toolbar: { options: ICondition[] } = { options: [] };
  marked!: ICondition;
  value = 0;

  ngOnInit(): void {
    this.loadConditions();
    this.initializeState();
  }

  private initializeState(): void {
    switch (this.state) {
      case 'create':
        this.initializeNewOdontogram();
        break;
      case 'update':
        this.loadExistingOdontogramByIdForm();
        break;
      case 'read':
        this.loadExistingOdontogram();
        break;
      case 'read-latest':
        this.loadLatestExistingOdontogram();
        break;
    }
  }
  loadLatestExistingOdontogram() {
    this.odontogramService
    .getService({
      url: `${UriConstants.GET_LAST_ODONTOGRAM_BY_PATIENT}/${this.patientId}`,
    })
    .subscribe({
      next: (response) => {
        this.data = this.mapResponseToOdontogram(response);
        this.renderOdontogram = true;
      },
      error: (error) => {
        this.renderOdontogram = false;
      },
    });
  }

  loadExistingOdontogramByIdForm() {
    //obtener el odontograma por idFormSection y por idPatientClinicalHistory
    this.odontogramService
      .getService({
        url: `${UriConstants.GET_ODONTOGRAM_BY_FORM_ID}/${this.idFormSection}/${this.patientId}`,
      })
      .subscribe({
        next: (response) => {
          this.data = this.mapResponseToOdontogram(response);
          this.renderOdontogram = true;
        },
        error: (error) => {},
      });

  }

  private initializeNewOdontogram(): void {
    //limpiar odontograma existente
    this.renderOdontogram = true;
    this.clearToothConditions(this.data.adultArcade.teeth);
    this.clearToothConditions(this.data.childrenArcade.teeth);
  }

  private clearToothConditions(teeth: ITooth[]): void {
    teeth.forEach((tooth) => {
      tooth.status = true;
      tooth.conditions = [];
      tooth.faces.forEach((face) => {
        face.conditions = [];
      });
    });
  }

  private loadExistingOdontogram(): void {
    this.odontogramService
      .getService({
        url: `${UriConstants.GET_LAST_ODONTOGRAM_BY_PATIENT}/${this.patientId}`,
      })
      .subscribe({
        next: (response) => {
          this.data = this.mapResponseToOdontogram(response);
          this.renderOdontogram = true;
        },
        error: (error) => {},
      });
  }

  private mapResponseToOdontogram(
    response: OdontogramResponse
  ): IOdontogramHandler {
    return mapOdontogramResponseToOdontogramData(response, this.data);
  }

  private loadConditions(): void {
    forkJoin({
      toothConditions: this.odontogramData.getToothCondition(),
      toothFaceConditions: this.odontogramData.getToothFaceCondition(),
    }).subscribe({
      next: ({ toothConditions, toothFaceConditions }) => {
        this.toolbar.options = [...toothConditions, ...toothFaceConditions];
        this.options = [...toothConditions, ...toothFaceConditions];
      },
      error: (error) => {
        this.toastr.error(error, 'Error');
      },
    });
  }

  handleChange(event: unknown, value: number): void {
    this.value = value;
  }

  handleAction(event: {
    description: string;
    condition: string;
    idCondition: number;
  }): void {
    
    this.marked = {
      idCondition: event.idCondition,
      condition: event.condition,
      description: event.description,
      selected: true,
    };

    this.toastr.info(`${event.condition}`, 'Condición seleccionada:', {
      timeOut: 1000,
      positionClass: 'toast-bottom-right',
      closeButton: false,
      progressBar: true,
      extendedTimeOut: 500,
      tapToDismiss: true,
      easeTime: 300,
      newestOnTop: true
    });
  }

  /**
   * Función para cambiar el estado de un diente (marcado/desmarcado).
   * @param data Información del diente.
   */
  toggleTooth(data: ITooth) {
    data.status = !data.status;
    if(data.status){
      this.removeConditionToTooth(data.idTooth, Constants.REMOVED_TOOTH_ID)
    }else{
      this.addConditionToTooth(data.idTooth, Constants.REMOVED_TOOTH_ID);
    }
  }

  removeConditionToTooth(idTooth: number, idCondition: number): void {
    const toothForPost = this.findOrCreateTooth(idTooth);
    const toothForDisplay = this.findOrCreateTooth(idTooth, true);

    // Remove condition from odontogram for POST
    toothForPost.conditions = toothForPost.conditions.filter(
      (condition) => condition.idCondition !== idCondition
    );

    // Remove condition from data for display
    toothForDisplay.conditions = toothForDisplay.conditions.filter(
      (condition) => condition.idCondition !== idCondition
    );
  }

  setFace(event: ToothEvent): void {
    const { tooth, faceId } = event;

    if (this.isAFaceCondition(this.marked)) {
      this.addConditionToFace(tooth.idTooth, faceId, this.marked.idCondition);
    } else {
      this.addConditionToTooth(tooth.idTooth, this.marked.idCondition);
    }
  }

  private isAFaceCondition(condition: ICondition): boolean {
    return this.toothFaceConditions.has(condition.condition);
  }

  private getTargetArcade(toothId: number): IOdontogram {
    // Determinar si el diente pertenece a la arcada adulta o infantil
    // Esta lógica puede variar según tu implementación específica
    const isAdultTooth = toothId >= 11 && toothId <= 48; // Ajusta según tu lógica de numeración
    return isAdultTooth ? this.data.adultArcade : this.data.childrenArcade;
  }

  private findOrCreateTooth(toothId: number, inStore: boolean = false): ITooth {
    let targetTooths: ITooth[];

    if (inStore) {
      const targetArcade = this.getTargetArcade(toothId);
      targetTooths = targetArcade.teeth;
    } else {
      targetTooths = this.odontogram.teeth;
    }

    let tooth = targetTooths.find((t) => t.idTooth === toothId);

    if (!tooth) {
      tooth = {
        idTooth: toothId,
        conditions: [],
        faces: [],
        status: true,
      };
      targetTooths.push(tooth);
    }

    return tooth;
  }

  private addConditionToTooth(toothId: number, conditionId: number): void {
    // Agregar al odontogram para el POST
    const toothForPost = this.findOrCreateTooth(toothId);
    // Agregar al data para la visualización
    const toothForDisplay = this.findOrCreateTooth(toothId, true);

    const condition = this.options.find((c) => c.idCondition === conditionId);
    if (condition) {
      // Agregar al odontogram si no existe
      if (!toothForPost.conditions.some((c) => c.idCondition === conditionId)) {
        toothForPost.conditions.push({ ...condition });
      }

      // Agregar al data si no existe
      if (
        !toothForDisplay.conditions.some((c) => c.idCondition === conditionId)
      ) {
        toothForDisplay.conditions.push({ ...condition });
      }
    }
  }

  private addConditionToFace(
    toothId: number,
    faceId: string,
    conditionId: number
  ): void {
    // Preparar dientes tanto para POST como para visualización
    const toothForPost = this.findOrCreateTooth(toothId);
    const toothForDisplay = this.findOrCreateTooth(toothId, true);

    // Preparar caras para POST
    let faceForPost = toothForPost.faces.find((f) => f.idFace === faceId);
    if (!faceForPost) {
      faceForPost = { idFace: faceId, conditions: [] };
      toothForPost.faces.push(faceForPost);
    }

    // Preparar caras para visualización
    let faceForDisplay = toothForDisplay.faces.find((f) => f.idFace === faceId);
    if (!faceForDisplay) {
      faceForDisplay = { idFace: faceId, conditions: [] };
      toothForDisplay.faces.push(faceForDisplay);
    }

    if (!faceForPost.conditions?.some((c) => c.idCondition === conditionId)) {
      this.odontogramData.getToothFaceCondition().subscribe({
        next: (options) => {
          const condition = options.find((c) => c.idCondition === conditionId);
          if (condition) {
            // Agregar condición al odontogram para POST
            faceForPost!.conditions = faceForPost!.conditions || [];
            faceForPost!.conditions.push({ ...condition });

            // Agregar condición al data para visualización
            faceForDisplay!.conditions = faceForDisplay!.conditions || [];
            faceForDisplay!.conditions.push({ ...condition });
          }
        },
        error: (error) => {
          console.error('Error adding condition to face:', error);
        },
      });
    }
  }

  public getQuadrantTeeth(teeth: ITooth[], quadrant: number): ITooth[] {
    // Para dientes adultos
    if (quadrant >= 1 && quadrant <= 4) {
      return teeth
        .filter((tooth) => {
          const id = tooth.idTooth;
          switch (quadrant) {
            case 1:
              return id >= 11 && id <= 18;
            case 2:
              return id >= 21 && id <= 28;
            case 3:
              return id >= 31 && id <= 38;
            case 4:
              return id >= 41 && id <= 48;
            default:
              return false;
          }
        })
        .sort((a, b) => {
          // Invertir la ordenación:
          // Actualmente: cuadrantes 1 y 4 orden ascendente, 2 y 3 descendente.
          // Requiere: cuadrantes 1 y 4 descendente, 2 y 3 ascendente.
          if (quadrant === 1 || quadrant === 4) {
            return b.idTooth - a.idTooth; // Orden descendente para el derecho
          } else {
            return a.idTooth - b.idTooth; // Orden ascendente para el izquierdo
          }
        });
    }
    // Para dientes infantiles
    else {
      return teeth
        .filter((tooth) => {
          const id = tooth.idTooth;
          switch (quadrant) {
            case 5:
              return id >= 51 && id <= 55;
            case 6:
              return id >= 61 && id <= 65;
            case 7:
              return id >= 71 && id <= 75;
            case 8:
              return id >= 81 && id <= 85;
            default:
              return false;
          }
        })
        .sort((a, b) => {
          if (quadrant === 5 || quadrant === 8) {
            return b.idTooth - a.idTooth; // Orden descendente para el derecho (según lógica deseada)
          } else {
            return a.idTooth - b.idTooth; // Orden ascendente para el izquierdo
          }
        });
    }
  }
  
  store(): void {

    switch (this.state) {
      case 'create':
        this.storeOdontogram();
        break;
      case 'update':
      case 'read-latest':
        this.storeOdontogram();
        break;
      case 'read':
        this.nextMatTab.emit();
        break;
    }
  }

  updateOdontogram() {
    this.nextMatTab.emit();
  }

  storeOdontogram(): void {
    const odontogramStore: OdontogramPost = this.mapOdontogramToPost();

    this.odontogramService
      .postService({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        url: `${UriConstants.POST_ODONTOGRAM}`,
        data: odontogramStore,
      })
      .subscribe({
        next: (response) => {
          this.nextMatTab.emit();
          this.nextTabEventEmitted.emit(false);
        },
        error: (error) => {
          console.error('Error storing odontogram:', error);
        },
      });
  }

  previousTab() {
    this.previousMatTab.emit();
  }

  nextTab() {
    this.nextMatTab.emit();
  }

  private mapOdontogramToPost(): OdontogramPost {
    return {
      idQuestion: this.idQuestion,
      idPatient: this.patientId,
      idPatientClinicalHistory: this.idClinicalHistoryPatient,
      idFormSection: this.idFormSection,
      teeth: this.odontogram.teeth.map((tooth: ITooth) => ({
        ...tooth,
        faces: tooth.faces.map((face: IFace) => ({
          ...face,
          idFace: Number(face.idFace),
          conditions: (face.conditions || []).map((condition: ICondition) => ({
            idToothFaceCondition: condition.idCondition,
            condition: condition.condition,
            description: condition.description,
          })),
        })),
      })),
    };
  }

  openDeleteConditionsDialog(tooth: ITooth): void {
    const dialogRef = this.dialog.open(DeleteConditionsDialogComponent, {
      width: '400px',
      data: { tooth }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeSelectedConditions(tooth.idTooth, result);
      }
    });
  }

  private removeSelectedConditions(
    toothId: number, 
    selected: {
      toothConditions: ICondition[],
      faceConditions: { idFace: string, conditions: ICondition[] }[]
    }
  ): void {
    const toothForPost = this.findOrCreateTooth(toothId);
    const toothForDisplay = this.findOrCreateTooth(toothId, true);

    // Eliminar condiciones seleccionadas del diente
    if (selected.toothConditions.length > 0) {
      const conditionIds = selected.toothConditions.map(c => c.idCondition);
      toothForPost.conditions = toothForPost.conditions.filter(
        c => !conditionIds.includes(c.idCondition)
      );
      toothForDisplay.conditions = toothForDisplay.conditions.filter(
        c => !conditionIds.includes(c.idCondition)
      );
    }

    // Eliminar condiciones seleccionadas de las caras
    selected.faceConditions.forEach(fc => {
      if (fc.conditions.length > 0) {
        const conditionIds = fc.conditions.map(c => c.idCondition);
        
        // Actualizar cara en POST
        const postFace = toothForPost.faces.find(f => f.idFace === fc.idFace);
        if (postFace) {
          postFace.conditions = (postFace.conditions || []).filter(
            c => !conditionIds.includes(c.idCondition)
          );
        }

        // Actualizar cara en display
        const displayFace = toothForDisplay.faces.find(f => f.idFace === fc.idFace);
        if (displayFace) {
          displayFace.conditions = (displayFace.conditions || []).filter(
            c => !conditionIds.includes(c.idCondition)
          );
        }
      }
    });

    this.toastr.success('Condiciones eliminadas correctamente', 'Éxito', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right'
    });
  }
}
