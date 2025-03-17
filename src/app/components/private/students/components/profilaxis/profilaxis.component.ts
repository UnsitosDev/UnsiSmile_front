import { Component, OnInit } from '@angular/core';
import { ThoothProphylaxis } from 'src/app/models/shared/prophylaxis/prophylaxis.model';
import { storeProphylaxis } from 'src/app/services/prophylaxis.service';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss'
})
export class ProfilaxisComponent implements OnInit {
  teeth = storeProphylaxis.theetProphylaxis;
  toothDisabled: boolean[] = Array(16).fill(true);
  toothDeactivated: boolean[] = Array(16).fill(false);
  showTriangle: boolean[] = Array(16).fill(false);
  selectedPolygons: Set<string> = new Set();

  ngOnInit(): void {
    this.toothDisabled = this.teeth.map(() => true);
    this.toothDeactivated = this.teeth.map(() => false);
    this.showTriangle = this.teeth.map(() => false);
  }

  changeColor(polygonId: string) {
    if (this.selectedPolygons.has(polygonId)) {
      this.selectedPolygons.delete(polygonId);
    } else {
      this.selectedPolygons.add(polygonId);
    }
    console.log("Polígonos seleccionados: ", this.selectedPolygons);
  }

  isSelected(polygonId: string): boolean {
    return this.selectedPolygons.has(polygonId);
  }

  deleteTooth(index: number) {
    this.toothDisabled[index] = false;
    this.clearPolygonsForTooth(index);
  }

  restoreTooth(index: number) {
    this.toothDisabled[index] = true;
  }

  clearPolygonsForTooth(index: number) {
    const polygonIds = [
      `polygon1-${index}`,
      `polygon2-${index}`,
      `polygon3-${index}`,
      `polygon4-${index}`,
    ];
    polygonIds.forEach((id) => this.selectedPolygons.delete(id));
  }

  deactivateTooth(index: number) {
    this.clearPolygonsForTooth(index);
    this.toothDeactivated[index] = !this.toothDeactivated[index];
    this.showTriangle[index] = this.toothDeactivated[index];
  }

  getQuadrant(teeth: ThoothProphylaxis[], quadrant: number): ThoothProphylaxis[] {
    if (quadrant >= 1 && quadrant <= 4) {
      return teeth
        .filter((tooth: ThoothProphylaxis) => {
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
        .sort((a: ThoothProphylaxis, b: ThoothProphylaxis) => {
          if (quadrant === 1 || quadrant === 4) {
            return b.idTooth - a.idTooth;
          } else {
            return a.idTooth - b.idTooth;
          }
        });
    } else {
      return [];
    }
  }
}