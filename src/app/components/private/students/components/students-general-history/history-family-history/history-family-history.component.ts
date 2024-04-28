import { Component } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ApiService, AuthService } from '@mean/services';
import { HttpHeaders } from '@angular/common/http';
import { UriConstants } from '@mean/utils';


@Component({
  selector: 'app-history-family-history',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './history-family-history.component.html',
  styleUrl: './history-family-history.component.scss'
})
export class HistoryFamilyHistoryComponent {
constructor(
  public authService: AuthService,
  public apiService: ApiService
){}
endExamFacial() {
  const token = this.authService.getToken();
  console.log(token);
  this.apiService
    .getListService({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
      url: `${UriConstants}`,
      data: {},
    })
    .subscribe({
      next: (response) => {

       console.log('response: ', response);

      },
      error: (error) => {
        console.error('Error en la autenticación:', error);
      },
    });
}
}
