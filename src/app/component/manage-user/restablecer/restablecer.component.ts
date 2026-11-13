import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/servicios/user.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

/** Página a la que lleva el enlace del correo "olvidé mi contraseña". */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-restablecer',
  template: `
    <div class="contenedor">
      <mat-card class="tarjeta">
        <h2>Restablecer contraseña</h2>
        <p *ngIf="!token" class="error">El enlace no es válido. Solicite uno nuevo desde "¿Olvidó su contraseña?".</p>
        <form *ngIf="token" [formGroup]="form" (ngSubmit)="guardar()">
          <mat-form-field appearance="outline" class="campo">
            <mat-label>Nueva contraseña</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
            <mat-hint>Mínimo 6 caracteres</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="outline" class="campo">
            <mat-label>Repetir contraseña</mat-label>
            <input matInput type="password" formControlName="confirmar" autocomplete="new-password" />
          </mat-form-field>
          <p class="error" *ngIf="form.errors?.['distintas'] && form.controls['confirmar'].dirty">Las contraseñas no coinciden.</p>
          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || guardando">Guardar</button>
          <button mat-button type="button" (click)="router.navigate(['/'])">Volver al inicio</button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`.contenedor { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f6f6; padding: 16px; }
            .tarjeta { width: min(420px, 100%); padding: 24px; } .campo { width: 100%; } .error { color: #c62828; }`],
})
export class RestablecerComponent implements OnInit {
  token = '';
  form: FormGroup;
  guardando = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private snackbar: SnackbarService,
    fb: FormBuilder
  ) {
    this.form = fb.group(
      { password: ['', [Validators.required, Validators.minLength(6)]], confirmar: ['', Validators.required] },
      { validators: (g: AbstractControl): ValidationErrors | null => (g.get('password')?.value === g.get('confirmar')?.value ? null : { distintas: true }) }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  guardar(): void {
    this.guardando = true;
    this.userService.resetPassword({ token: this.token, password: this.form.value.password }).subscribe({
      next: (r) => {
        this.snackbar.openSnackBar(r.message, 'success');
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.guardando = false;
        this.snackbar.openSnackBar(e.error?.message || GlobalCostants.genericError, GlobalCostants.error);
      },
    });
  }
}
