import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-update-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-update-admin.component.html',
  styleUrl: './form-update-admin.component.scss'
})
export class FormUpdateAdminComponent implements OnInit {
  employeeNumber: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.employeeNumber = this.route.snapshot.params['employeeNumber'];
    console.log('Número de empleado recibido:', this.employeeNumber);
  }
}
