import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CanchaService, Cancha } from 'src/app/servicios/cancha.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { puede } from 'src/app/shared/permisos';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { exportarPDF } from 'src/app/shared/reporte-pdf';

/** Gestión de campos de juego (RF10): agregar, modificar, eliminar, listar y reporte. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manage-campo-de-juego',
  templateUrl: './manage-campo-de-juego.component.html',
  styleUrls: ['./manage-campo-de-juego.component.scss'],
})
export class ManageCampoDeJuegoComponent implements OnInit {
  columnas = ['nombre', 'tipo', 'direccion', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Cancha>([]);
  form: FormGroup;
  editando: Cancha | null = null;
  mostrarForm = false;
  puedeEditar = puede('GESTION');
  tipos = ['Fútbol', 'Fútbol de salón', 'Fútbol 8', 'Básquet', 'Vóley', 'Polifuncional'];

  constructor(
    private canchaService: CanchaService,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      tipo: [''],
      direccion: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.canchaService.listar().subscribe({
      next: (c) => (this.dataSource.data = c),
      error: (e) => this.error(e),
    });
  }

  filtrar(ev: Event): void {
    this.dataSource.filter = (ev.target as HTMLInputElement).value.trim().toLowerCase();
  }

  nuevo(): void {
    this.editando = null;
    this.form.reset({ nombre: '', tipo: '', direccion: '' });
    this.mostrarForm = true;
  }

  editar(c: Cancha): void {
    this.editando = c;
    this.form.reset({ nombre: c.nombre, tipo: c.tipo || '', direccion: c.direccion || '' });
    this.mostrarForm = true;
  }

  guardar(): void {
    if (this.form.invalid) return;
    const datos = { ...this.form.value, id_cancha: this.editando?.id_cancha };
    const peticion = this.editando ? this.canchaService.actualizar(datos) : this.canchaService.agregar(datos);
    peticion.subscribe({
      next: (r) => { this.snackbar.openSnackBar(r.message, 'success'); this.mostrarForm = false; this.cargar(); },
      error: (e) => this.error(e),
    });
  }

  cambiarEstado(c: Cancha, activo: boolean): void {
    this.canchaService.cambiarEstado(c.id_cancha, activo).subscribe({
      next: (r) => { this.snackbar.openSnackBar(r.message, 'success'); this.cargar(); },
      error: (e) => this.error(e),
    });
  }

  eliminar(c: Cancha): void {
    const ref = this.dialog.open(ConfirmationComponent, { data: { message: 'eliminar el campo de juego ' + c.nombre } });
    ref.componentInstance.onEmitStatusChange.subscribe(() => {
      ref.close();
      this.canchaService.eliminar(c.id_cancha).subscribe({
        next: (r) => { this.snackbar.openSnackBar(r.message, 'success'); this.cargar(); },
        error: (e) => this.error(e),
      });
    });
  }

  /** RF10.5: reporte PDF de campos de juego */
  reporte(): void {
    exportarPDF({
      titulo: 'Reporte de campos de juego',
      columnas: ['N°', 'Nombre', 'Tipo', 'Dirección', 'Estado'],
      filas: this.dataSource.filteredData.map((c, i) => [i + 1, c.nombre, c.tipo || '', c.direccion || '', c.estado === 'true' ? 'Activo' : 'Inactivo']),
      archivo: 'campos_de_juego',
    });
  }

  private error(e: any): void {
    this.snackbar.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
