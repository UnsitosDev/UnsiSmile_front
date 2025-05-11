import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { StudentsToolbarComponent } from './../toolbar-odontogram/students-toolbar.component';
import { StudentsToothComponent } from './../tooth/students-tooth.component';

import {
  ApiService,
  AuthService,
  createOdontogramHandler,
  OdontogramData,
} from '@mean/services';
import { Constants, ToothConditionsConstants } from '@mean/utils';

import { HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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
import { TokenData } from 'src/app/components/public/login/model/tokenData';
import { DeleteConditionsDialogComponent } from '../delete-conditions-dialog/delete-conditions-dialog.component';
import { OdontogramMapper } from './odontogramMapper';

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
    MatCardModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './students-odontogram.component.html',
  styleUrl: './students-odontogram.component.scss',
})
export class StudentsOdontogramComponent implements OnInit, TabsHandler {
  constructor(private dialog: MatDialog) {}

  private odontogramService = inject(ApiService<{}, OdontogramPost>);
  @Input({ required: true }) patientId!: string;
  @Input({ required: true }) idTreatment!: number;
  @Input({ required: true }) state!:
    | 'create'
    | 'update'
    | 'read'
    | 'read-latest';
  private toastr = inject(ToastrService);
  private userService = inject(AuthService);
  private token!: string;
  private tokenData!: TokenData;
  role!: string;

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

  data: IOdontogramHandler = createOdontogramHandler(); //odontograma que se renderiza
  odontogram: IOdontogram = { teeth: [], observations: '' }; //odontograma que se insertará
  options: ICondition[] = [];
  faces: IFace[] = [];
  toolbar: { options: ICondition[] } = { options: [] };
  marked!: ICondition;
  value = 0;

  ngOnInit(): void {
    this.loadConditions();
    this.initializeState();
    this.getRole();
  }

  getRole() {
    this.token = this.userService.getToken() ?? '';
    this.tokenData = this.userService.getTokenDataUser(this.token);
    this.role = this.tokenData.role[0].authority;
  }

  private initializeState(): void {
    switch (this.state) {
      case 'create':
        this.initializeNewOdontogram();
        break;
      case 'update':
        //this.loadExistingOdontogramByIdForm();
        break;
      case 'read':
        //this.loadExistingOdontogramByIdForm();
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
        next: (response: OdontogramResponse) => {
          // Update data for rendering
          OdontogramMapper.mapOdontogramResponseToData(response);
          this.renderOdontogram = true;
        },
        error: (error) => {
          this.renderOdontogram = false;
        },
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
          OdontogramMapper.mapOdontogramResponseToData(response);
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
  }

  /**
   * Función para cambiar el estado de un diente (marcado/desmarcado).
   * @param data Información del diente.
   */
  toggleTooth(data: ITooth) {
    data.status = !data.status;
    if (data.status) {
      this.removeConditionToTooth(data.idTooth, Constants.REMOVED_TOOTH_ID);
    } else {
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
    const odontogramStore: OdontogramPost = OdontogramMapper.mapOdontogramToPost(this.patientId, this.odontogram, this.idTreatment);

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

  openDeleteConditionsDialog(tooth: ITooth): void {
    const dialogRef = this.dialog.open(DeleteConditionsDialogComponent, {
      width: '400px',
      data: { tooth },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeSelectedConditions(tooth, result);
      }
    });
  }

  private removeSelectedConditions(
    tooth: ITooth,
    selected: {
      toothConditions: ICondition[];
      faceConditions: { idFace: string; conditions: ICondition[] }[];
    }
  ): void {
    // Obtener la instancia del diente para POST y la de visualización (data)
    const toothForPost = this.findOrCreateTooth(tooth.idTooth);
    const toothForDisplay = this.findOrCreateTooth(tooth.idTooth, true);

    // Eliminar condiciones a nivel de diente usando comparación por idCondition o condición
    if (selected.toothConditions && selected.toothConditions.length > 0) {
      toothForPost.conditions = toothForPost.conditions.filter(
        (c) =>
          !selected.toothConditions.some(
            (s) =>
              (s.idCondition !== null && s.idCondition === c.idCondition) ||
              (s.idCondition === null && s.condition === c.condition)
          )
      );
      toothForDisplay.conditions = toothForDisplay.conditions.filter(
        (c) =>
          !selected.toothConditions.some(
            (s) =>
              (s.idCondition !== null && s.idCondition === c.idCondition) ||
              (s.idCondition === null && s.condition === c.condition)
          )
      );
    }

    // Eliminar condiciones a nivel de cara
    selected.faceConditions.forEach((faceGroup) => {
      // Actualizar POST
      const postFace = toothForPost.faces.find(
        (f) => f.idFace === faceGroup.idFace
      );
      if (postFace) {
        postFace.conditions = (postFace.conditions || []).filter(
          (c) =>
            !faceGroup.conditions.some(
              (s) =>
                (s.idCondition !== null && s.idCondition === c.idCondition) ||
                (s.idCondition === null && s.condition === c.condition)
            )
        );
      }
      // Actualizar visualización
      const displayFace = toothForDisplay.faces.find(
        (f) => f.idFace === faceGroup.idFace
      );
      if (displayFace) {
        displayFace.conditions = (displayFace.conditions || []).filter(
          (c) =>
            !faceGroup.conditions.some(
              (s) =>
                (s.idCondition !== null && s.idCondition === c.idCondition) ||
                (s.idCondition === null && s.condition === c.condition)
            )
        );
      }
    });

    // Verifica si el diente ya no tiene condiciones a nivel general y en sus caras
    if (
      toothForPost.conditions.length === 0 &&
      toothForPost.faces.every((face) => (face.conditions || []).length === 0)
    ) {
      // Elimina el diente del odontograma para POST
      this.odontogram.teeth = this.odontogram.teeth.filter(
        (t) => t.idTooth !== tooth.idTooth
      );
    }

    this.toastr.success('Condiciones eliminadas correctamente', 'Éxito', {
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    });
  }
}
