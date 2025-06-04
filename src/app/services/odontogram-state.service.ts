import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICondition, ITooth, IOdontogramHandler } from '@mean/models';

@Injectable({
  providedIn: 'root'
})
export class OdontogramStateService {
  private selectedSymbolSubject = new BehaviorSubject<ICondition | null>(null);
  private teethSubject = new BehaviorSubject<ITooth[]>([]);
  private odontogramHandlerSubject = new BehaviorSubject<IOdontogramHandler | null>(null);

  // Observable streams
  selectedSymbol$ = this.selectedSymbolSubject.asObservable();
  teeth$ = this.teethSubject.asObservable();
  odontogramHandler$ = this.odontogramHandlerSubject.asObservable();

  constructor() {}

  // Symbol selection methods
  selectSymbol(symbol: ICondition | null): void {
    this.selectedSymbolSubject.next(symbol);
  }

  getSelectedSymbol(): ICondition | null {
    return this.selectedSymbolSubject.value;
  }

  // Teeth management methods
  updateTeeth(teeth: ITooth[]): void {
    this.teethSubject.next(teeth);
  }

  updateOdontogramHandler(handler: IOdontogramHandler): void {
    this.odontogramHandlerSubject.next(handler);
    // Update the flat teeth array with all teeth from both arcades
    this.updateTeeth([...handler.adultArcade.teeth, ...handler.childrenArcade.teeth]);
  }

  updateTooth(toothId: number, condition: ICondition, faceId?: string): void {
    const currentTeeth = this.teethSubject.value;
    const toothIndex = currentTeeth.findIndex(t => t.idTooth === toothId);
    
    if (toothIndex === -1) return;

    const updatedTeeth = [...currentTeeth];
    const tooth = { ...updatedTeeth[toothIndex] };

    if (faceId) {
      // Update face condition
      const faceIndex = tooth.faces.findIndex(f => f.idFace === faceId);
      if (faceIndex !== -1) {
        const face = { ...tooth.faces[faceIndex] };
        face.conditions = face.conditions || [];
        
        // Check if condition already exists
        const conditionExists = face.conditions.some(c => c.idCondition === condition.idCondition);
        if (!conditionExists) {
          face.conditions.push({ ...condition });
          tooth.faces[faceIndex] = face;
        }
      }
    } else {
      // Update tooth condition
      tooth.conditions = tooth.conditions || [];
      const conditionExists = tooth.conditions.some(c => c.idCondition === condition.idCondition);
      if (!conditionExists) {
        tooth.conditions.push({ ...condition });
      }
    }

    updatedTeeth[toothIndex] = tooth;
    this.teethSubject.next(updatedTeeth);

    // Update the odontogram handler if it exists
    const currentHandler = this.odontogramHandlerSubject.value;
    if (currentHandler) {
      const updatedHandler = { ...currentHandler };
      const isAdultTooth = toothId >= 11 && toothId <= 48;
      const arcade = isAdultTooth ? updatedHandler.adultArcade : updatedHandler.childrenArcade;
      const arcadeToothIndex = arcade.teeth.findIndex(t => t.idTooth === toothId);
      
      if (arcadeToothIndex !== -1) {
        arcade.teeth[arcadeToothIndex] = tooth;
        this.odontogramHandlerSubject.next(updatedHandler);
      }
    }
  }

  removeCondition(toothId: number, conditionId: number, faceId?: string): void {
    const currentTeeth = this.teethSubject.value;
    const toothIndex = currentTeeth.findIndex(t => t.idTooth === toothId);
    
    if (toothIndex === -1) return;

    const updatedTeeth = [...currentTeeth];
    const tooth = { ...updatedTeeth[toothIndex] };

    if (faceId) {
      // Remove face condition
      const faceIndex = tooth.faces.findIndex(f => f.idFace === faceId);
      if (faceIndex !== -1) {
        const face = { ...tooth.faces[faceIndex] };
        face.conditions = (face.conditions || []).filter(c => c.idCondition !== conditionId);
        tooth.faces[faceIndex] = face;
      }
    } else {
      // Remove tooth condition
      tooth.conditions = (tooth.conditions || []).filter(c => c.idCondition !== conditionId);
    }

    updatedTeeth[toothIndex] = tooth;
    this.teethSubject.next(updatedTeeth);

    // Update the odontogram handler if it exists
    const currentHandler = this.odontogramHandlerSubject.value;
    if (currentHandler) {
      const updatedHandler = { ...currentHandler };
      const isAdultTooth = toothId >= 11 && toothId <= 48;
      const arcade = isAdultTooth ? updatedHandler.adultArcade : updatedHandler.childrenArcade;
      const arcadeToothIndex = arcade.teeth.findIndex(t => t.idTooth === toothId);
      
      if (arcadeToothIndex !== -1) {
        arcade.teeth[arcadeToothIndex] = tooth;
        this.odontogramHandlerSubject.next(updatedHandler);
      }
    }
  }

  clearToothConditions(toothId: number): void {
    const currentTeeth = this.teethSubject.value;
    const toothIndex = currentTeeth.findIndex(t => t.idTooth === toothId);
    
    if (toothIndex === -1) return;

    const updatedTeeth = [...currentTeeth];
    const tooth = { ...updatedTeeth[toothIndex] };
    
    tooth.conditions = [];
    tooth.faces = tooth.faces.map(face => ({
      ...face,
      conditions: []
    }));

    updatedTeeth[toothIndex] = tooth;
    this.teethSubject.next(updatedTeeth);

    // Update the odontogram handler if it exists
    const currentHandler = this.odontogramHandlerSubject.value;
    if (currentHandler) {
      const updatedHandler = { ...currentHandler };
      const isAdultTooth = toothId >= 11 && toothId <= 48;
      const arcade = isAdultTooth ? updatedHandler.adultArcade : updatedHandler.childrenArcade;
      const arcadeToothIndex = arcade.teeth.findIndex(t => t.idTooth === toothId);
      
      if (arcadeToothIndex !== -1) {
        arcade.teeth[arcadeToothIndex] = tooth;
        this.odontogramHandlerSubject.next(updatedHandler);
      }
    }
  }
} 