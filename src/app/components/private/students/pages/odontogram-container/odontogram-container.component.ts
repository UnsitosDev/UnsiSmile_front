import { Component, Input } from '@angular/core';
import { OdontogramContainerBaseComponent } from '../../components/odontogram-container-base/odontogram-container-base.component';
import { OdontogramComponent } from '../../components/odontogram/odontogram.component';
import { OdontogramListComponent } from '../../components/odontogram-list/odontogram-list.component';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-odontogram-container',
  standalone: true,
  imports: [OdontogramComponent, OdontogramListComponent, MatCardTitle, MatCardContent, MatCard],
  templateUrl: './odontogram-container.component.html',
  styleUrl: './odontogram-container.component.scss'
})
export class OdontogramContainerComponent  extends OdontogramContainerBaseComponent {
   @Input({required:true}) public patientUuid!: string;
}
