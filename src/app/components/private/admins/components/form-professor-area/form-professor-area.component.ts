import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-professor-area',
  standalone: true,
  imports: [],
  templateUrl: './form-professor-area.component.html',
  styleUrl: './form-professor-area.component.scss'
})
export class FormProfessorAreaComponent implements OnInit {
  employeeNumber: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.employeeNumber = this.route.snapshot.params['employeeNumber'];
  }
}
