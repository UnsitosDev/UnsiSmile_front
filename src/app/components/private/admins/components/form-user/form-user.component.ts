import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { studentResponse, studentUserResponse } from 'src/app/shared/interfaces/student/student';
import { AdminResponse } from 'src/app/models/shared/admin/admin.model';
import { ApiService } from '@mean/services';
import { UriConstants } from '@mean/utils';


@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent {
  private userService = inject(ApiService<studentResponse, {}>);
  tabs = ['Datos de Usuario', 'Contraseña'];
  activeTab = signal(0);
  nombre = signal('');
  email = signal('');
  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  confirmarContrasena = signal('');
  foto = signal<string | null>(null);
  user!: studentUserResponse | AdminResponse;

  ngOnInit() {
    this.fetchUserData();
  }

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }

  actualizarDatosUsuario() {
    console.log('Actualizando datos de usuario:', { nombre: this.nombre(), email: this.email() });
    //lógica para actualizar los datos en el backend
  }

  actualizarContrasena() {
    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Actualizando contraseña');
    //lógica para actualizar la contraseña en el backend
  }

  subirFoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.foto.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  
  fetchUserData() {
    this.userService
      .getService({
        url: `${UriConstants.GET_USER_INFO}`,
      })
      .subscribe({
        next: (data) => {
          this.user = data;
          console.log('user data: ', data);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      });
  }


}


