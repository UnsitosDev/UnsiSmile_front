import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from 'src/app/shared/services';
import { UriConstants } from '@mean/utils';
import { LoadingComponent } from '@mean/shared';
import { CardProfessorDataComponent } from '../../components/card-professor-data/card-professor-data.component';
import { FormUpdateProfessorComponent } from "../../components/form-update-professor/form-update-professor.component";
import { TableAssignGroupComponent } from "../../components/table-assign-group/table-assign-group.component";
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details-professor',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule,
    CardProfessorDataComponent,
    FormUpdateProfessorComponent,
    TableAssignGroupComponent,
    LoadingComponent
  ],
  templateUrl: './details-professor.component.html',
  styleUrl: './details-professor.component.scss'
})
export class DetailsProfessorComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly toastr = inject(ToastrService);

  public professorId!: string;
  public isLoading = false;
  private suppressTabChangeLogic = false;

  ngOnInit(): void {
    this.routeParams();
  }

  private routeParams() {
    this.route.params.subscribe((params) => {
      this.professorId = params['professorId'];
      if (!this.professorId) {
        this.toastr.error('No se proporcionó ID del profesor');
        this.router.navigate(['/medical-admin/professors']);
      }
    });
  }

  public onTabSelected(event: any): void {
    if (this.suppressTabChangeLogic) {
      this.suppressTabChangeLogic = false;
      return;
    }

    const tabIndex = event.index;
    switch (tabIndex) {
      case 0:
        // Tab de datos personales, no necesita cargar datos adicionales
        break;
      case 1:
        // Tab de grupos asignados, ya maneja su propia carga de datos
        break;
      default:
        console.warn('Tab index not handled:', tabIndex);
    }
  }

  onBack(): void {
    this.router.navigate(['/medical-admin/professors']);
  }
}
