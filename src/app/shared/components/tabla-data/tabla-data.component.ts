import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [NgxPaginationModule, FormsModule],
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
  itemsPerPage = 10;
  pageSizes = [10, 20, 20, 50];
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

  @Output() pageSizeChange = new EventEmitter<number>();

  @Output() searchChange: EventEmitter<string> = new EventEmitter();



  onAction(accion: string, row?: any) {
    this.action.emit({ accion: accion, fila: row });
  }

  onPageChange(page: number) {
    this.page = page;
    this.updatePaginatedData();
  }
  onPageSizeChange() {
    this.pageSizeChange.emit(this.itemsPerPage);
    this.updatePaginatedData();
  }

  private updatePaginatedData() {
    const start = (this.page - 1) * this.itemsPerPage;
    const end = this.page * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  filterData() {
    if (this.searchText.length >= 2 || this.searchText.length === 0) {
      console.log('Texto de búsqueda:', this.searchText); // Debug
      this.searchChange.emit(this.searchText);
    }
  }

  // Método para exportar los datos filtrados y paginados a Excel


 
}
