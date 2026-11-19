import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DatosMotivo {
  titulo: string;
  mensaje?: string;
  etiqueta?: string;
  boton?: string;
  obligatorio?: boolean;
  color?: 'primary' | 'warn';
}

/** Pide un comentario (observación, motivo de rechazo). Devuelve el texto o undefined si se cancela. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-motivo-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.titulo }}</h2>
    <mat-dialog-content>
      <p *ngIf="data.mensaje" class="mensaje">{{ data.mensaje }}</p>
      <mat-form-field appearance="outline" class="campo">
        <mat-label>{{ data.etiqueta || 'Comentario' }}</mat-label>
        <textarea matInput [formControl]="texto" rows="4" maxlength="500" cdkFocusInitial></textarea>
        <mat-hint align="end">{{ texto.value?.length || 0 }}/500</mat-hint>
        <mat-error>Escriba al menos 3 caracteres</mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button [color]="data.color || 'primary'" [disabled]="texto.invalid" (click)="ref.close(texto.value?.trim() || '')">
        {{ data.boton || 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.campo { width: 100%; } .mensaje { margin-bottom: 12px; color: #424242; }`],
})
export class MotivoDialogComponent {
  texto: FormControl<string | null>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DatosMotivo, public ref: MatDialogRef<MotivoDialogComponent>) {
    this.texto = new FormControl('', data.obligatorio === false ? [] : [Validators.required, Validators.minLength(3)]);
  }
}
