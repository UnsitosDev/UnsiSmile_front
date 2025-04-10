import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WelcomeMessageService {
  getWelcomeMessage(genderId: number): string {
    switch (genderId) {
      case 1:
        return 'Bienvenido a UnsiSmile';
      case 2:
        return 'Bienvenida a UnsiSmile';
      case 99:
        return 'Bienvenide a UnsiSmile';
      default:
        return 'Bienvenido a UnsiSmile';
    }
  }
}
