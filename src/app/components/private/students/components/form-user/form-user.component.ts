import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.scss'
})
export class FormUserComponent {
  tabs = ['Datos de Usuario', 'Contraseña'];
  activeTab = signal(0);
  nombre = signal('');
  email = signal('');
  contrasenaActual = signal('');
  nuevaContrasena = signal('');
  confirmarContrasena = signal('');
  foto = signal<string | null>(null);

  setActiveTab(index: number) {
    this.activeTab.set(index);
  }

  actualizarDatosUsuario() {
    console.log('Actualizando datos de usuario:', { nombre: this.nombre(), email: this.email() });
    // Aquí iría la lógica para actualizar los datos en el backend
  }

  actualizarContrasena() {
    if (this.nuevaContrasena() !== this.confirmarContrasena()) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('Actualizando contraseña');
    // Aquí iría la lógica para actualizar la contraseña en el backend
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
}


