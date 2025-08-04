import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminProfile, StudentProfile, ProfessorProfile } from 'src/app/models/shared/profile/profile.model';

/**
 * Servicio para manejar la sincronización de datos del usuario y foto de perfil
 * entre diferentes componentes de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private profilePictureUpdatedSource = new Subject<string | null>();
  profilePictureUpdated = this.profilePictureUpdatedSource.asObservable();

  private userDataUpdatedSource = new Subject<AdminProfile | StudentProfile | ProfessorProfile>();
  userDataUpdated = this.userDataUpdatedSource.asObservable();

  updateProfilePicture(newProfilePicture: string | null) {
    this.profilePictureUpdatedSource.next(newProfilePicture);
  }

  updateUserData(userData: AdminProfile | StudentProfile | ProfessorProfile) {
    this.userDataUpdatedSource.next(userData);
  }
}
