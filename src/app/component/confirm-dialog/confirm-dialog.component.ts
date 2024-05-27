// confirm-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  message: string;
  extraInfo?: Array<{
    title: string;
    value: string;
  }>;
  buttonText: {
    ok: string;
    cancel: string;
  };
}

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div style="min-width: 400px;">
      <h2 mat-dialog-title>Attenzione</h2>

      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>

      <div mat-dialog-content *ngIf="data.extraInfo">
        <ul>
          <li *ngFor="let data of data.extraInfo">{{data.title}} : {{data.value}}</li>
        </ul>
      </div>

      <div mat-dialog-actions class="containerPulsantiDiv">
        <div class="button-container">
          <p-button severity="info"   [raised]="true" size="small" mat-button color="primary" (click)="onYesClick()">{{ data.buttonText.ok }}</p-button>
          <p-button severity="danger" [raised]="true" size="small" mat-button (click)="onNoClick()">{{ data.buttonText.cancel }}</p-button>
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

    @media (max-width: 600px) {
      .containerPulsantiDiv {
        flex-direction: column;
        align-items: center;
      }

      .button-container {
        flex-direction: column;
        width: 100%;
        gap: 4px; /* Riduci lo spazio tra i pulsanti per adattarlo meglio agli schermi piccoli */
      }

      .mat-dialog-container {
        min-width: auto; /* Permette al contenitore del dialogo di adattarsi alla larghezza del dispositivo */
        width: 90vw; /* Occupare il 90% della larghezza della finestra visibile */
        padding: 16px; /* Aggiungi padding per evitare che il contenuto tocchi i bordi */
      }

      .mat-dialog-content {
        word-wrap: break-word; /* Consente il wrapping delle parole per evitare overflow */
      }
    }
  `],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
