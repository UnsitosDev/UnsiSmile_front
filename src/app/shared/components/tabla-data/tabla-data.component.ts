import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [NgxPaginationModule, FormsModule, CommonModule],
  templateUrl: './tabla-data.component.html',
  styleUrls: ['./tabla-data.component.scss']
})
export class TablaDataComponent implements OnInit, OnDestroy {
  title = '';
  columnas: string[] = [];
  dataSource: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  page = 1;
  itemsPerPage = 10;
  pageSizes = [10, 20, 30, 50];
  searchText = '';
  sortField: string = 'person.firstName';
  sortAsc: boolean = true;

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

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

  @Input() totalItems: number = 0;

  @Input() sortableColumns: { [key: string]: string } = {};

  @Input() showSearchIcon: boolean = false;
  @Input() showEditIcon: boolean = false;
  @Input() showFolderIcon: boolean = false;
  @Input() showStatusIcon: boolean = false;
  @Input() showInsertIcon: boolean = false;
  @Input() showDeleteIcon: boolean = false;
  @Input() showAssignIcon: boolean = false;
  @Input() showAssignDigitizerIcon: boolean = false;
  @Input() showPatientsIcon: boolean = false;
  @Input() showMedicalHistoryIcon: boolean = false;
  


  @Output() action: EventEmitter<Accion> = new EventEmitter();

  @Output() pageSizeChange = new EventEmitter<number>();

  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  @Output() pageChange = new EventEmitter<number>();

  @Output() sortChange: EventEmitter<{field: string, asc: boolean}> = new EventEmitter();

  @Output() statusChange: EventEmitter<{ row: any, newStatus: string }> = new EventEmitter();

  ngOnInit() {
    this.setupSearchDebounce();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  private setupSearchDebounce() {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(500), // Espera 500ms después de la última entrada
      distinctUntilChanged() 
    ).subscribe(searchValue => {
      this.searchChange.emit(searchValue);
    });
  }

  onAction(accion: string, row?: any) {
    if (accion === 'changeStatus') {
      const newStatus = row.estatus === 'Activo' ? 'Inactivo' : 'Activo';
      this.statusChange.emit({ row, newStatus });
    } else if (accion === 'edit') {  // Cambiado de 'Modificar' a 'edit'
      this.action.emit({ accion: 'Editar', fila: row });  // Emitimos 'Editar' como acción
    } else {
      this.action.emit({ accion: accion, fila: row });
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.pageChange.emit(page);
    this.updatePaginatedData();
  }
  onPageSizeChange() {
    this.pageSizeChange.emit(this.itemsPerPage);
    this.updatePaginatedData();
  }

  private updatePaginatedData() {
    this.paginatedData = this.filteredData;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  filterData() {
    this.page = 1; // Resetear a la primera página cuando se busca
    this.searchSubject.next(this.searchText);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'activo':
        return 'status-active';
      case 'inactive':
      case 'inactivo':
        return 'status-inactive';
      case 'pending':
      case 'pendiente':
        return 'status-pending';
      default:
        return '';
    }
  }

  onSort(column: string) {
    if (this.sortableColumns[column]) {
      if (this.sortField === this.sortableColumns[column]) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortField = this.sortableColumns[column];
        this.sortAsc = true;
      }
      this.sortChange.emit({ field: this.sortField, asc: this.sortAsc });
    }
  }

  getSortIcon(column: string): string {
    if (!this.sortableColumns[column]) return '';
    if (this.sortField !== this.sortableColumns[column]) return 'fas fa-sort';
    return this.sortAsc ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }
}
