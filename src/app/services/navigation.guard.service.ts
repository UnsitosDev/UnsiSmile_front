import { Injectable, OnDestroy } from '@angular/core';
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

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  initialize(protectedRoutes: string[]): void {
    this.cleanup();
    this.resetState();
    this.protectedRoutes = [...protectedRoutes, ...this.additionalRoutes];
    this.setupNavigationGuard();
  }

  private resetState(): void {
    this.navigationInProgress = false;
    this.navigationComplete = false;
    this.navigationTarget = '';
    this.isNavigationPrevented = true;
  }

  private setupNavigationGuard(): void {
    // Suscripción a NavigationStart con tipado correcto
    const startSub = this.router.events.pipe(
      filter((event: Event): event is NavigationStart => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (!this.navigationInProgress && !this.navigationComplete) {
        this.handleProtectedNavigation(event);
      }
    });

    // Suscripción a NavigationEnd con tipado correcto
    const endSub = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.resetState();
    });

    this.navigationSubscriptions.push(startSub, endSub);
  }

  private handleProtectedNavigation(event: NavigationStart): void {
    if (this.protectedRoutes.includes(event.url)) {
      this.navigationTarget = event.url;
      this.openDialog('300ms', '200ms', Messages.CONFIRM_LEAVE_TREATMENTS);
    }
  }

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

  private cleanup(): void {
    this.navigationSubscriptions.forEach(sub => sub.unsubscribe());
    this.navigationSubscriptions = [];
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}