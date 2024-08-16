import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ipatients } from '../models/shared/patients';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient ){ }

  obtenerPacientes():Observable<Ipatients[]>{
    return this.http.get<Ipatients[]>("/assets/data/pacientes.json");
  }}
