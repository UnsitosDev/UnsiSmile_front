import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';

import { store } from '@mean/services';
import { OdontogramData } from 'src/app/services/odontogram-data.service';
import { ToothConditionsConstants } from 'src/app/utils/ToothConditions.constant';
import { StudentsToolbarComponent } from '../toolbar-odontogram/students-toolbar.component';
import { StudentsToothComponent } from '../tooth/students-tooth.component';

import {
  ICondition,
  IFace,
  IOdontogram,
  IOdontogramHandler,
  ITooth
} from 'src/app/models/shared/odontogram';
import { TabsHandler } from 'src/app/shared/components/interfaces/tabs_handler';

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
  @Input({ required: true }) patientId!: number;
  @Input({ required: true }) idFormSection!: number;
  
  @Output() nextTabEventEmitted = new EventEmitter<boolean>();
  @Output() nextMatTab = new EventEmitter<void>(); // Evento para ir al siguiente tab
  @Output() previousMatTab = new EventEmitter<void>(); // Evento para ir al tab anterior

  private readonly odontogramData = inject(OdontogramData);
  private readonly toothFaceConditions = new Set([
    ToothConditionsConstants.DIENTE_CARIADO,
    ToothConditionsConstants.DIENTE_OBTURADO,
    ToothConditionsConstants.DIENTE_CON_FRACTURA,
    ToothConditionsConstants.DIENTE_OBTURADO_CON_CARIES
  ]);

  data: IOdontogramHandler = store;
  odontogram: IOdontogram = { tooths: [] };
  options: ICondition[] = [];
  faces: IFace[] = [];
  toolbar: { options: ICondition[] } = { options: [] };
  marked!: ICondition;
  value = 0;

  ngOnInit(): void {
    this.loadConditions();
  }

  private loadConditions(): void {
    forkJoin({
      toothConditions: this.odontogramData.getToothCondition(),
      toothFaceConditions: this.odontogramData.getToothFaceCondition()
    }).subscribe({
      next: ({ toothConditions, toothFaceConditions }) => {
        this.toolbar.options = [...toothConditions, ...toothFaceConditions];
        this.options = [...toothConditions, ...toothFaceConditions];
      },
      error: (error) => {
        console.error('Error loading conditions:', error);
      }
    });
  }

  handleChange(event: unknown, value: number): void {
    this.value = value;
  }

  handleAction(event: { description: string; condition: string; idCondition: number }): void {
    this.marked = {
      idCondition: event.idCondition,
      condition: event.condition,
      description: event.description,
    };
  }

    /**
   * Función para cambiar el estado de un diente (marcado/desmarcado).
   * @param data Información del diente.
   */
    toggleTooth(data: any) {
      data.status = !data.status;
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
      targetTooths = targetArcade.tooths;
    } else {
      targetTooths = this.odontogram.tooths;
    }

    let tooth = targetTooths.find(t => t.idTooth === toothId);
    
    if (!tooth) {
      tooth = {
        idTooth: toothId,
        conditions: [],
        faces: [],
        status: true
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
    
    const condition = this.options.find(c => c.idCondition === conditionId);
    if (condition) {
      // Agregar al odontogram si no existe
      if (!toothForPost.conditions.some(c => c.idCondition === conditionId)) {
        toothForPost.conditions.push({ ...condition });
      }
      
      // Agregar al data si no existe
      if (!toothForDisplay.conditions.some(c => c.idCondition === conditionId)) {
        toothForDisplay.conditions.push({ ...condition });
      }
    }
  }

  private addConditionToFace(toothId: number, faceId: string, conditionId: number): void {
    // Preparar dientes tanto para POST como para visualización
    const toothForPost = this.findOrCreateTooth(toothId);
    const toothForDisplay = this.findOrCreateTooth(toothId, true);

    // Preparar caras para POST
    let faceForPost = toothForPost.faces.find(f => f.idFace === faceId);
    if (!faceForPost) {
      faceForPost = { idFace: faceId, conditions: [] };
      toothForPost.faces.push(faceForPost);
    }

    // Preparar caras para visualización
    let faceForDisplay = toothForDisplay.faces.find(f => f.idFace === faceId);
    if (!faceForDisplay) {
      faceForDisplay = { idFace: faceId, conditions: [] };
      toothForDisplay.faces.push(faceForDisplay);
    }

    if (!faceForPost.conditions?.some(c => c.idCondition === conditionId)) {
      this.odontogramData.getToothFaceCondition().subscribe({
        next: (options) => {
          const condition = options.find(c => c.idCondition === conditionId);
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
        }
      });
    }
  }

  public getQuadrantTeeth(teeth: ITooth[], quadrant: number): ITooth[] {
    // Para dientes adultos
    if (quadrant >= 1 && quadrant <= 4) {
      return teeth.filter(tooth => {
        const id = tooth.idTooth;
        switch (quadrant) {
          case 1: return id >= 11 && id <= 18;
          case 2: return id >= 21 && id <= 28;
          case 3: return id >= 31 && id <= 38;
          case 4: return id >= 41 && id <= 48;
          default: return false;
        }
      }).sort((a, b) => {
        // Ordenar dientes de manera apropiada según el cuadrante
        if (quadrant === 1 || quadrant === 4) {
          return a.idTooth - b.idTooth; // orden ascendente para cuadrantes derechos
        } else {
          return b.idTooth - a.idTooth; // orden descendente para cuadrantes izquierdos
        }
      });
    }
    // Para dientes infantiles
    else {
      return teeth.filter(tooth => {
        const id = tooth.idTooth;
        switch (quadrant) {
          case 5: return id >= 51 && id <= 55;
          case 6: return id >= 61 && id <= 65;
          case 7: return id >= 71 && id <= 75;
          case 8: return id >= 81 && id <= 85;
          default: return false;
        }
      }).sort((a, b) => {
        // Ordenar dientes de manera apropiada según el cuadrante
        if (quadrant === 5 || quadrant === 8) {
          return a.idTooth - b.idTooth; // orden ascendente para cuadrantes derechos
        } else {
          return b.idTooth - a.idTooth; // orden descendente para cuadrantes izquierdos
        }
      });
    }
  }

  store(): void {
    console.log('Storing odontogram:', this.odontogram);
    this.nextMatTab.emit();
    this.nextTabEventEmitted.emit(false);
  }

  previousTab() {
    this.previousMatTab.emit();
  }
}