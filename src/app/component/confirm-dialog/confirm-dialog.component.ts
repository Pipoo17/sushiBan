// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div style="min-width: 400px;">
      <h2 mat-dialog-title>Attenzione</h2>

      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>

      <div mat-dialog-content *ngIf="data.dettaglio">
        <ul>
          <li *ngFor="let item of data.dettaglio.split('\n')" >{{ item }}</li>
        </ul>
      </div>

      <div mat-dialog-actions class="containerPulsantiDiv">
        <div class="button-container">
          <p-button severity="info"   [outlined]="true" [raised]="true" size="small" mat-button color="primary" (click)="onYesClick()">{{ data.buttonText.ok }}</p-button>
          <p-button severity="danger" [outlined]="true" [raised]="true" size="small" mat-button (click)="onNoClick()">{{ data.buttonText.cancel }}</p-button>
        </div>
      </div>
    </div>
    <br>
  `,
  styles: [`
    .containerPulsantiDiv {
      display: flex;
      justify-content: center;
    }

    .button-container {
      display: flex;
      gap: 8px; /* Spazio tra i pulsanti, puoi regolare questo valore secondo le tue esigenze */
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
