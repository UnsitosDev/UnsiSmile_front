import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule],
  templateUrl: './tabla-data.component.html',
  styleUrls: ['./tabla-data.component.scss']
})
export class TablaDataComponent {
  title = '';
  columnas: string[] = [];
  dataSource: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  page = 1;
  itemsPerPage = 2;
  pageSizes = [1, 2, 20, 50];
  searchText = '';

  @Input() set titulo(title: any) {
    this.title = title;
  }

  @Input() set columns(columns: string[]) {
    this.columnas = columns;
  }

  @Input() set data(data: any[]) {
    this.dataSource = data;
    this.filteredData = data;
    this.paginatedData = data;
  }

  @Output() action: EventEmitter<Accion> = new EventEmitter();

  onAction(accion: string, row?: any) {
    this.action.emit({ accion: accion, fila: row });
  }

  onPageChange(page: number) {
    this.page = page;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  filterData() {
    this.filteredData = this.dataSource.filter(item => {
      return this.columnas.some(column => {
        return item[column].toString().toLowerCase().includes(this.searchText.toLowerCase());
      });
    });
  }

  // Método para exportar los datos filtrados y paginados a Excel
  exportToExcel() {
    const dataToExport = this.filteredData.slice(
      (this.page - 1) * this.itemsPerPage,
      this.page * this.itemsPerPage
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, 'data.xlsx');
  }

 
}
