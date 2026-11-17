import { leerToken, puede, urlDocumentoPrivado } from 'src/app/shared/permisos';
import { ESTADOS, SolicitudesService } from 'src/app/solicitudes/solicitudes.service';
import { SolicitarPaseDialogComponent } from 'src/app/solicitudes/solicitar-pase-dialog.component';
import { MotivoDialogComponent } from 'src/app/solicitudes/motivo-dialog.component';
import { exportarPDF } from 'src/app/shared/reporte-pdf';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PasejugadorService } from 'src/app/servicios/pasejugador.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { PasejugadorComponent } from '../dialog/pasejugador/pasejugador.component';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manaje-pase-jugador',
  templateUrl: './manaje-pase-jugador.component.html',
  styleUrls: ['./manaje-pase-jugador.component.scss']
})
export class ManajePaseJugadorComponent implements OnInit {

  displayedColumns: string[] = ['numero','ci','jugador','clubsolicitante','clubsolicitado','fecha', 'documento', 'estado', 'acciones'];
  estados = ESTADOS;
  esDelegado = leerToken()?.role === 'delegado';
  esComite = puede('GESTION');
  private miClub = leerToken()?.id_club;
  dataSource: any; //almacena los tatos extraidos del backend
  responseMessage: any;

  //----url del servidor backend
  url = environment.apiUrl;
  //----creamos la url para las imagenes
  imgURL = this.url + '/uploads/img/';

  constructor( private paseJugadorServise: PasejugadorService,
    private solicitudes: SolicitudesService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) { }

  ngOnInit(): void {
    this.tableData();
  }

  
  tableData() {
    this.paseJugadorServise.getPase().subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(PasejugadorComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddPase.subscribe((response) => {
      this.tableData();
    })
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(PasejugadorComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditPase.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar el pase de ' + values.nombre 
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deletePase(values.id_pase);
      dialogRef.close();
    });
  }

  deletePase(id: any) {
    this.paseJugadorServise.delete(id).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  onChange(estado: any, id: any) {
    var data = {
      estado: estado.toString(),
      id_pase: id
    }
    this.paseJugadorServise.updateStatus(data).subscribe((response: any) => {
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }



  /** Reporte PDF de la lista (respeta el filtro de búsqueda) */
  reportePDF() {
    const datos: any[] = this.dataSource?.filteredData || this.dataSource?.data || [];
    exportarPDF({
      titulo: 'Reporte de pases de jugador',
      columnas: ['N°', 'CI', 'Jugador', 'Club solicitante', 'Club de origen', 'Fecha'],
      filas: datos.map((f: any, i: number) => [i + 1, f.ci, [f.nombre, f.ap_paterno, f.ap_materno].join(' '), f.club_solicitante, f.club_solicitado, f.fecha2]),
      archivo: 'pases',
      orientacion: 'landscape',
    });
  }

  /** Los documentos personales solo se abren con sesión iniciada */
  docPrivado(nombre: string): string {
    return urlDocumentoPrivado(this.imgURL, nombre);
  }

  // ---------- Pase en 3 pasos ----------
  esMiClub(idClub: any): boolean {
    return String(idClub) === String(this.miClub);
  }

  /** Paso 1: el club de destino solicita */
  solicitarPase() {
    this.dialog.open(SolicitarPaseDialogComponent, { width: '560px', maxWidth: '96vw' })
      .afterClosed().subscribe((ok) => ok && this.tableData());
  }

  /** Paso 2: el club de origen acepta o rechaza */
  responder(p: any, decision: 'aceptar' | 'rechazar') {
    const nombre = `${p.nombre} ${p.ap_paterno}`;
    this.dialog.open(MotivoDialogComponent, {
      width: '440px',
      data: {
        titulo: decision === 'aceptar' ? 'Aceptar pase' : 'Rechazar pase',
        mensaje: `${p.club_solicitante} solicita el pase de ${nombre} (CI ${p.ci}).`,
        obligatorio: decision === 'rechazar',
        etiqueta: decision === 'aceptar' ? 'Comentario (opcional)' : 'Motivo del rechazo',
        boton: decision === 'aceptar' ? 'Aceptar' : 'Rechazar',
        color: decision === 'aceptar' ? 'primary' : 'warn',
      },
    }).afterClosed().subscribe((texto) => {
      if (texto === undefined) return;
      const fd = new FormData();
      fd.append('decision', decision);
      if (texto) fd.append('observacion', texto);
      this.solicitudes.responderPase(p.id_pase, fd).subscribe({ next: (r) => this.ok(r.message), error: (e) => this.fallo(e) });
    });
  }

  /** Paso 3: el comité técnico aprueba o rechaza */
  revisar(p: any, decision: 'aprobar' | 'rechazar') {
    this.dialog.open(MotivoDialogComponent, {
      width: '440px',
      data: {
        titulo: decision === 'aprobar' ? 'Aprobar pase' : 'Rechazar pase',
        mensaje: `${p.nombre} ${p.ap_paterno} (CI ${p.ci}): ${p.club_solicitado} → ${p.club_solicitante}.`,
        obligatorio: decision === 'rechazar',
        etiqueta: decision === 'aprobar' ? 'Comentario (opcional)' : 'Motivo del rechazo',
        boton: decision === 'aprobar' ? 'Aprobar' : 'Rechazar',
        color: decision === 'aprobar' ? 'primary' : 'warn',
      },
    }).afterClosed().subscribe((texto) => {
      if (texto === undefined) return;
      this.solicitudes.revisarPase(p.id_pase, decision, texto || undefined).subscribe({ next: (r) => this.ok(r.message), error: (e) => this.fallo(e) });
    });
  }

  anular(p: any) {
    this.solicitudes.anularPase(p.id_pase).subscribe({ next: (r) => this.ok(r.message), error: (e) => this.fallo(e) });
  }

  private ok(m: string) {
    this.snackbarService.openSnackBar(m, 'success');
    this.tableData();
  }

  private fallo(e: any) {
    this.snackbarService.openSnackBar(e?.error?.message || GlobalCostants.genericError, GlobalCostants.error);
  }
}
