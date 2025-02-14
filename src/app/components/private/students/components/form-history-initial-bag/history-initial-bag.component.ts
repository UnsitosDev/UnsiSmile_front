import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IOdontogramHandler } from '@mean/models';
import { store } from '@mean/services';

interface Column {
  header: string; 
}
interface Row {
  label: string; 
  values: string[];
}
interface LowerVestibular {
  title: string; 
  id: number; 
  columns: Column[]; 
  rows: Row[]; 
}

@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss',
})
export class HistoryInitialBagComponent implements OnInit {
  data: IOdontogramHandler = store;
  upperVestibular: any;
  lowerVestibular: any;
  palatine: any;
  linguals: any;

  ngOnInit(): void {

    const columnsUpperVestibular = [
      { header: "" },
      ...this.data.adultArcade.teeth.slice(0, 8).map(tooth => ({ header: tooth.idTooth })),
      { header: "" },
      ...this.data.adultArcade.teeth.slice(8, 16).map(tooth => ({ header: tooth.idTooth }))
    ];

    const columnsLowerVestibular = [
      { header: "" },
      ...this.data.adultArcade.teeth.slice(16, 24).map(tooth => ({ header: tooth.idTooth })),
      { header: "" },
      ...this.data.adultArcade.teeth.slice(24, 32).map(tooth => ({ header: tooth.idTooth }))
    ];

    this.upperVestibular = {
      title: "VESTIBULARES SUPERIORES",
      id: 1,
      // id : 
      // row { id, label }
      columns: columnsUpperVestibular,
      rows: [
        { id:1, label: "D", values: ["", "", "", "", "", "", "", "", "D", "", "", "", "", "", "", "", ""] },
        { id:1, label: "M", values: ["", "", "", "", "", "", "", "", "M", "", "", "", "", "", "", "", ""] },
        { id:1, label: "M", values: ["", "", "", "", "", "", "", "", "M", "", "", "", "", "", "", "", ""] }
      ]
    };

    this.lowerVestibular = {
      title: "VESTIBULARES INFERIORES",
      id: 2,
      columns: columnsLowerVestibular,
      rows: [
        { label: "D", values: ["", "", "", "", "", "", "", "", "D", "", "", "", "", "", "", "", ""] },
        { label: "M", values: ["", "", "", "", "", "", "", "", "M", "", "", "", "", "", "", "", ""] },
        { label: "M", values: ["", "", "", "", "", "", "", "", "M", "", "", "", "", "", "", "", ""] }
      ]
    };

    
  }
}