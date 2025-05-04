import { trigger, transition, style, animate, state } from '@angular/animations';

export const submenuAnimation = trigger('submenuAnimation', [
  transition(':enter', [
    style({ 
      height: 0, 
      opacity: 0,
      transform: 'translateY(-10px)'
    }),
    animate('220ms cubic-bezier(0.35, 0, 0.25, 1)', 
      style({ 
        height: '*', 
        opacity: 1,
        transform: 'translateY(0)'
      })
    )
  ]),
  transition(':leave', [
    style({
      height: '*',
      opacity: 1,
      transform: 'translateY(0)'
    }),
    animate('200ms cubic-bezier(0.35, 0, 0.25, 1)', 
      style({
        height: 0,
        opacity: 0,
        transform: 'translateY(-10px)'
      })
    )
  ])
]);

export const rotateIcon = trigger('rotateIcon', [
  state('collapsed', style({ transform: 'rotate(0deg)' })),
  state('expanded', style({ transform: 'rotate(180deg)' })),
  transition('collapsed <=> expanded', [
    animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
  ])
]);
