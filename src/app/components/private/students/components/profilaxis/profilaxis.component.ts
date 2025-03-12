import { Component } from '@angular/core';

@Component({
  selector: 'app-profilaxis',
  standalone: true,
  imports: [],
  templateUrl: './profilaxis.component.html',
  styleUrl: './profilaxis.component.scss'
})
export class ProfilaxisComponent {
  figures = Array(16).fill(0);
  figureSize = 100; 
}
