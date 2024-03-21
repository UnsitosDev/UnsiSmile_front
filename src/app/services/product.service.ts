import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IKeyboard } from '../models/tabla/keyboard';
import { IMouse } from '../models/tabla/mouse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient ){ }

  obtenerKeyboardList():Observable<IKeyboard[]>{
    return this.http.get<IKeyboard[]>("/assets/data/lista1.json");
  }

  obtenerMouseList():Observable<IMouse[]>{
    return this.http.get<IMouse[]>("/assets/data/lista2.json");
  }
}
