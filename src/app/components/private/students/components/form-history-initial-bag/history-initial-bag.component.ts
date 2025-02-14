import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IOdontogramHandler } from '@mean/models';
import { store } from '@mean/services';

@Component({
  selector: 'app-history-initial-bag',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './history-initial-bag.component.html',
  styleUrl: './history-initial-bag.component.scss',
})
export class HistoryInitialBagComponent implements OnInit {
  data: IOdontogramHandler = store;
  tableData: any;

  ngOnInit(): void {
    console.log(this.data);

    // Generar los encabezados de las columnas dinámicamente
    const columns = [
      { header: "" },
      ...this.data.adultArcade.teeth.slice(0, 8).map(tooth => ({ header: tooth.idTooth })),
      { header: "" },
      ...this.data.adultArcade.teeth.slice(8, 16).map(tooth => ({ header: tooth.idTooth }))
    ];

    this.tableData = {
      title: "VESTIBULARES SUPERIORES",
      columns: columns,
      rows: [
        { label: "D", values: ["", "", "", "", "", "", "", "", "D", "", "", "", "", "", "", "", ""] },
        { label: "M", values: ["", "", "", "", "", "", "", "", "M", "", "", "", "", "", "", "", ""] },
        { label: "M", values: ["", "", "", "", "", "", "", "", "M", "", "", "", "", "", "", "", ""] }
      ]
    };
  }
}