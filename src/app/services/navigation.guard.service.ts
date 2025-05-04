import { inject, Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, Event } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, filter } from 'rxjs';
import { Messages } from '../utils/messageConfirmLeave';
import { DialogConfirmLeaveComponent } from '../components/private/students/components/dialog-confirm-leave/dialog-confirm-leave.component';

@Injectable({
    providedIn: 'root'
})
export class NavigationGuardService implements OnDestroy {
    private readonly additionalRoutes = ['/students/user'];
    private navigationSubscriptions: Subscription[] = [];
    private navigationInProgress: boolean = false;
    private navigationComplete: boolean = false;
    private navigationTarget: string = '';
    private isNavigationPrevented: boolean = true;
    private protectedRoutes: string[] = [];
    private router = inject(Router);
    private dialog = inject(MatDialog);

    /**
   * Inicializa el guardia de navegación con las rutas protegidas especificadas
   * @param {string[]} protectedRoutes - Arreglo de rutas a proteger
   */
    initialize(protectedRoutes: string[]): void {
        this.cleanup();
        this.resetState();
        this.protectedRoutes = [...protectedRoutes, ...this.additionalRoutes];
        this.setupNavigationGuard();
    }

    /**
   * Reinicia el estado interno del guardia de navegación
   * @private
   */
    private resetState(): void {
        this.navigationInProgress = false;
        this.navigationComplete = false;
        this.navigationTarget = '';
        this.isNavigationPrevented = true;
    }

    /**
   * Configura los listeners de eventos del router para protección de navegación
   * @private
   */
    private setupNavigationGuard(): void {
        const startSub = this.router.events.pipe(
            filter((event: Event): event is NavigationStart => event instanceof NavigationStart)
        ).subscribe((event: NavigationStart) => {
            if (!this.navigationInProgress && !this.navigationComplete) {
                this.handleProtectedNavigation(event);
            }
        });

        const endSub = this.router.events.pipe(
            filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.resetState();
        });

        this.navigationSubscriptions.push(startSub, endSub);
    }

    /**
   * Maneja eventos de navegación protegida
   * @param {NavigationStart} event - El evento de inicio de navegación
   * @private
   */
    private handleProtectedNavigation(event: NavigationStart): void {
        if (this.protectedRoutes.includes(event.url)) {
            this.navigationTarget = event.url;
            this.openDialog('300ms', '200ms', Messages.CONFIRM_LEAVE_TREATMENTS);
        }
    }

    /**
   * Abre un diálogo de confirmación al intentar navegar fuera de rutas protegidas
   * @param {string} enterAnimationDuration - Duración de animación de entrada del diálogo
   * @param {string} exitAnimationDuration - Duración de animación de salida del diálogo
   * @param {string} message - Mensaje de confirmación a mostrar
   * @public
   */
    public openDialog(enterAnimationDuration: string, exitAnimationDuration: string, message: string): void {
        if (this.isNavigationPrevented) {
            this.router.navigateByUrl(this.router.url);
        }

        const dialogRef = this.dialog.open(DialogConfirmLeaveComponent, {
            width: '400px',
            enterAnimationDuration,
            exitAnimationDuration,
            data: { message }
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.navigationInProgress = false;
            if (result) {
                this.isNavigationPrevented = false;
                this.navigationComplete = true;
                setTimeout(() => {
                    this.router.navigateByUrl(this.navigationTarget);
                }, 0);
            }
        });
    }

    /**
   * Limpia todas las suscripciones activas
   * @private
   */
    private cleanup(): void {
        this.navigationSubscriptions.forEach(sub => sub.unsubscribe());
        this.navigationSubscriptions = [];
    }

    /**
   * Hook de ciclo de vida de Angular para limpieza cuando el servicio es destruido
   */
    ngOnDestroy(): void {
        this.cleanup();
    }
}