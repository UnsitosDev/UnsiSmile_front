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
    responsibleProfessor = 13; // Catálogo catedrático responsable

    // Devuelve un Observable para que otros servicios o componentes puedan suscribirse
    public getProfesorArea(): Observable<any> {
        return this.apiService.getService({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            url: `${UriConstants.GET_PROFESOR_AREA}/${this.responsibleProfessor}`,
            data: {},
        });
    }
}