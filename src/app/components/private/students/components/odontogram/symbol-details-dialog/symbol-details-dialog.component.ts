import { Component, Inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface SymbolDetailsData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-symbol-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './symbol-details-dialog.component.html',
  styleUrls: ['./symbol-details-dialog.component.scss']
})
export class SymbolDetailsDialogComponent {
  isMobile = false;
  dialogWidth = '450px';

  constructor(
    public dialogRef: MatDialogRef<SymbolDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SymbolDetailsData,
    private breakpointObserver: BreakpointObserver
  ) {
    this.checkScreenSize();
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.isMobile = this.breakpointObserver.isMatched('(max-width: 599px)');
      this.dialogWidth = this.isMobile ? '90vw' : '450px';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 600; // 600px es el breakpoint de Angular Material para móviles
    this.dialogWidth = this.isMobile ? '90vw' : '450px';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
