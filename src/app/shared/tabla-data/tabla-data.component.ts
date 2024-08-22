import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Accion } from 'src/app/models/tabla/tabla-columna';

@Component({
  selector: 'app-tabla-data',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatInputModule, CommonModule],
  templateUrl: './tabla-data.component.html',
  styleUrls: ['./tabla-data.component.scss']
})
export class TablaDataComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  title = '';
  columnas: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  @Input() set titulo(title: string) {
    this.title = title;
  }

  @Input() set columns(columns: string[]) {
    this.columnas = columns;
  }

  @Input() set data(data: any[]) {
    this.dataSource.data = data;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  @Output() action: EventEmitter<Accion> = new EventEmitter();

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onAction(accion: string, row?: any) {
    this.action.emit({ accion: accion, fila: row });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
