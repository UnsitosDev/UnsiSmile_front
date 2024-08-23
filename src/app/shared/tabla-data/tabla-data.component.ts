import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, FormsModule], // Agrega FormsModule
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
  itemsPerPage = 2; // Valor inicial de elementos por página
  pageSizes = [1, 2, 20, 50]; // Opciones para el selector
  searchText = ''; // Texto de búsqueda

  @Input() set titulo(title: any) {
    this.title = title;
  }

  @Input() set columns(columns: string[]) {
    this.columnas = columns;
  }

  @Input() set data(data: any[]) {
    this.dataSource = data;
    this.filteredData = data; // Inicializa los datos filtrados
    this.paginatedData = data; // Inicializa los datos paginados
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

  // Método para filtrar los datos
  filterData() {
    this.filteredData = this.dataSource.filter(item => {
      return this.columnas.some(column => {
        return item[column].toString().toLowerCase().includes(this.searchText.toLowerCase());
      });
    });
  }
}
