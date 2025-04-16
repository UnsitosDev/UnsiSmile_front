import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-clinical-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-clinical-area.component.html',
  styleUrl: './form-clinical-area.component.scss'
})
export class FormClinicalAreaComponent implements OnInit {
  areaId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.areaId = params['id'];
      console.log('ID del área clínica:', this.areaId);
    });
  }
}
