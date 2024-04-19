import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-students-toolbar',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './students-toolbar.component.html',
  styleUrl: './students-toolbar.component.scss'
})
export class StudentsToolbarComponent {
  @Input() toolbar: any;
  @Output() handleAction = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.handleActionSubscription();
    console.log(this.handleActionSubscription);
    
  }


  handleActionSubscription() {
    // Suscribirse al evento handleAction del componente StudentsToolbarComponent
    this.handleAction.subscribe((event: any) => {
      // Manejar los datos recibidos aquí
      console.log('Datos recibidos:', event);
      // Verificar si se debe pintar todo el diente
      if (event.all && event.all === true) {
        // Tu lógica para pintar todo el diente aquí
        console.log('Pintar todo el diente');
      } else {
        // Tu lógica para pintar una región específica aquí, si lo deseas
        console.log('Pintar una región específica');
      }
    });
  }

  onButtonClicked(item: any): void {
    this.handleAction.emit({ cor: item.cor, nome: item.nome, icon: item.icon, all:item.all });
    console.log('item:', item);
} 

// onButtonClicked(item: any): void {
//   if (item.all && item.all === true) {
//     this.handleAction.emit({ all: true });
//   } else {
//     this.handleAction.emit({ cor: item.cor, nome: item.nome, icon: item.icon, all: false });
//   }
//   console.log('item:', item);
// }



}
