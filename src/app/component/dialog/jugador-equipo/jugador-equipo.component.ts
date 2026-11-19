import { environment } from 'src/environments/environment';
import { exportarCarnets } from 'src/app/shared/carnets-pdf';
import { Component, EventEmitter, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EquipoJugadorService } from 'src/app/servicios/equipo-jugador.service';
import { EquipoService } from 'src/app/servicios/equipo.service';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogConfig } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';
import { rolPantalla } from '../../../shared/permisos';
//reporte
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmationComponent } from '../confirmation/confirmation.component';


@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-jugador-equipo',
  templateUrl: './jugador-equipo.component.html',
  styleUrls: ['./jugador-equipo.component.scss']
})
export class JugadorEquipoComponent implements OnInit {
  displayedColumnsCheck: string[] = ['nombre'];
  displayedColumns: string[] = ['numero', 'nombre', 'edad'];
  action: any = "Agregar";
  dataSource: any;
  dataEquipoJugador: any;
  buscar = '';

  /** Jugadores del club que coinciden con la búsqueda (nombre, apellidos o CI) */
  filtrados(): any[] {
    const t = this.buscar.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const lista = Array.isArray(this.dataSource) ? this.dataSource : [];
    if (!t) return lista;
    return lista.filter((j: any) => `${j.nombre} ${j.ap_paterno} ${j.ap_materno} ${j.ci}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(t));
  }
  role: any;
  num_max_jugadores: any;

  onAdd = new EventEmitter();
  onEdit = new EventEmitter();
  equipoForm: any = FormGroup;
  responseMessage: any;

  jugador: any;
  disciplina: any;

  //-----PARA REPORTES
  userName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private equipoJugadorService: EquipoJugadorService,
    private formBuilder: FormBuilder,
    private jugadorService: JugadorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private dialogRef: MatDialogRef<JugadorEquipoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.disciplina = (this.dialogData.data_categoria.nombre_disciplina + ' ' + this.dialogData.data_categoria.nombre_categoria).toUpperCase();
    this.getEquipoJugador();
    if (this.dialogData.action === 'addJugador') {
      this.action = (this.dialogData.data_equipo.nombre_club).toUpperCase(); //Club
      console.log('datos Equipo ' + JSON.stringify(this.dialogData.data_equipo));
      console.log('datos Categoria (CONTEMPLA) ' + JSON.stringify(this.dialogData.data_categoria));
      this.num_max_jugadores = this.dialogData.data_categoria.num_max_jugadores;
      this.getJugadoresByEdad(this.dialogData.data_equipo.id_club);
    }

    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token y extraer el Rol
      const decodedToken: any = jwtDecode(token);
      this.role = rolPantalla('EQUIPOS'); // 'admin' = puede modificar en este módulo
      this.userName = decodedToken?.nombre || 'Nombre desconocido';
    } else {
      console.log('No hay token en localStorage');
    }
  }


  //----------------------OPTENEMOS LISTA DE JUGADORES DE UN CLUB ESPECIFICO

  getJugadoresByEdad(id_club: any) {
    var data = {
      id_club: id_club,
      sexo: this.dialogData.data_categoria.genero,
      edad_min: this.dialogData.data_categoria.edad_min,
      edad_max: this.dialogData.data_categoria.edad_max,
    }
    this.jugadorService.getJugadoresByEdad(data.id_club, data.sexo, data.edad_min, data.edad_max).subscribe((response: any) => {
      this.dataSource = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO -----------------------------------------
  getEquipoJugador() {
    this.equipoJugadorService.get(this.dialogData.data_equipo.id_club, this.dialogData.data_equipo.id_contempla).subscribe((response: any) => {
      this.dataEquipoJugador = response;
    });
  }

  //------------------------------------------------------------------------------------------------
  handleSubmit() {
    this.dialogRef.close();
    this.onAdd.emit();
    this.responseMessage = 'Datos guardado correctamente';
    this.snackbarService.openSnackBar(this.responseMessage, "success");
  }

  //------------AGREGAR O ELIMINAR JUGADORES
  add_or_delete(checked: any, ci: any) {
    var data = {
      id_club: this.dialogData.data_equipo.id_club,
      id_contempla: this.dialogData.data_equipo.id_contempla,
      ci: ci,
    }
    if (checked) {
      // this.equipoJugadorService.add(data).subscribe((response: any) => {
      //   console.log("AGREGADO CORRECTAMENTE");
      //   this.getEquipoJugador();
      // })

      if (this.dataEquipoJugador.length < this.num_max_jugadores) {
        this.equipoJugadorService.add(data).subscribe((response: any) => {
          console.log("AGREGADO CORRECTAMENTE");
          this.getEquipoJugador();
        });
      } else {
        this.snackBar.open("No se puede agregar más jugadores. Se alcanzó el número máximo permitido.", "Cerrar", {
          duration: 7000, // Duración en milisegundos (3 segundos)
        });

        // const dialogConfig = new MatDialogConfig();
        // dialogConfig.data = {
        //   message: 'Se alcanzó el número máximo de jugadores permitido: ' + this.num_max_jugadores
        // };
        // const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
        // const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
        //   this.ngxService.start();
        //   dialogRef.close();
        // });

      }
    } else {
      this.equipoJugadorService.delete(data.id_club, data.id_contempla, data.ci).subscribe((response: any) => {
        console.log("ELIMINADO CORRECTAMENTE");
        this.getEquipoJugador();
      })
    }
    console.log("value1: " + checked);
    console.log("value2 " + ci);
  }

  //---------------- COMPROBAR SI EL JUGADOR YA ESTA AGREGADO EN EL EQUIPO
  comprobarSiExiste(ci: any) {
    let estado = false;
    let tamaño = Object.keys(this.dataEquipoJugador).length;
    for (let i = 0; i < tamaño; i++) {
      if (ci == this.dataEquipoJugador[i].ci) {
        estado = true;
        break;
      }
      else {
        estado = false;
      }
    }
    return estado;
  }


  //----------------- GENERAR REPORTE-NOMINA DE JUGADOR POR DISCIPLINA Y CLUB
  generatePDF() {
    const doc = new jsPDF();

    // Obtener los datos filtrados
    const filteredData = this.dataEquipoJugador;

    // Cargar la imagen del logo desde la carpeta de assets
    const logoImg = new Image();
    logoImg.src = '../../../assets/img/logo-iyt.png'; // Ruta de la imagen en tu proyecto

    logoImg.onload = () => {

      // Agregar el encabezado con el logo, usuario y fecha
      doc.addImage(logoImg, 'PNG', 170, 3, 26, 23);// Ajusta la posición y tamaño según sea necesario
      doc.setFontSize(12);
      doc.text('NÓMINA ' + this.disciplina + ' CLUB ' + this.action, 50, 28);

      const date = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado por: ${this.userName}`, 15, 10);
      doc.text(`Fecha: ${date}`, 15, 15);

      // Función para agregar encabezado y pie de página en cada página
      const addHeaderAndFooter = () => {

        // Agregar numeración de página en el pie de página
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`Página ${i}`, 100, doc.internal.pageSize.getHeight() - 10);
        }
      };

      // Agregar el encabezado antes de crear la tabla
      addHeaderAndFooter();

      // Definir las columnas para la tabla
      const columns = ['Nº', 'CI', 'Nombre', 'Edad', 'Fecha de Nacimiento', 'Club', 'Firma      .'];

      // Mapear los datos filtrados para agregar el índice de numeración
      const rows = filteredData.map((item, index) => [
        index + 1,
        item.ci,
        item.nombre + ' ' + item.ap_paterno + ' ' + item.ap_materno,
        item.edad,
        item.fecha_nac,
        this.action //CLUB
      ]);

      // Agregar la tabla al PDF usando autoTable
      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 30, // Ajusta la posición de inicio de la tabla
        theme: 'striped',
        didDrawPage: (data) => {
          // Volver a agregar el encabezado y pie de página en cada página nueva creada por autoTable
          addHeaderAndFooter();
        }
      });

      // Guardar el PDF
      //doc.save('reporte.pdf');
      doc.save('NÓMINA-' + this.disciplina + '-' + this.action + '.pdf')
    };
  }

  //----------------- GENERAR CARNETS DE JUGADOR POR DISCIPLINA

  /** Carnets con los datos del campeonato (número romano, comunidad anfitriona, gestión), logo del club anfitrión y foto del jugador */
  async generateCarnetsPDF() {
    const c = this.dialogData.data_categoria || {};
    this.ngxService.start();
    try {
      await exportarCarnets({
        jugadores: this.dataEquipoJugador || [],
        club: this.action,
        categoria: this.disciplina,
        numeroRomano: c.numero_romano,
        comunidadAnfitriona: c.comunidad_anfitriona,
        gestion: c.gestion,
        logoAnfitrion: c.logo_club_anfitrion,
        urlArchivos: environment.apiUrl + '/uploads/img/',
        archivo: 'CARNETS-' + this.disciplina + '-' + this.action + '.pdf',
      });
    } finally {
      this.ngxService.stop();
    }
  }





}
