import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Accion } from 'src/app/models/tabla/tabla-columna';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [NgxPaginationModule, FormsModule],
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

  @Output() action: EventEmitter<Accion> = new EventEmitter();

  @Output() pageSizeChange = new EventEmitter<number>();

  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  @Output() pageChange = new EventEmitter<number>();

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
    this.action.emit({ accion: accion, fila: row });
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
    const start = (this.page - 1) * this.itemsPerPage;
    const end = this.page * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  filterData() {
    this.searchSubject.next(this.searchText);
  }

  // Método para exportar los datos filtrados y paginados a Excel


 
}
