import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UriConstants } from '@mean/utils';

@Injectable({
    providedIn: 'root'
})
export class ProfesorService {
    apiService = inject(ApiService);

    // Devuelve un Observable para que otros servicios o componentes puedan suscribirse
    public getProfesorArea(page: number = 0): Observable<any> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_PROFESOR_AREA}?page=${page}`, // Agregar el parámetro de página
            data: {},
        });
    }
}