import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { JugadorComponent } from '../dialog/jugador/jugador.component';
import * as _ from 'lodash';
import { ClubService } from 'src/app/servicios/club.service';
import jwt_decode from 'jwt-decode';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonsts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonsts.pdfMake.vfs;


//reporte
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-manage-jugador',
  templateUrl: './manage-jugador.component.html',
  styleUrls: ['./manage-jugador.component.scss']
})
export class ManageJugadorComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'foto', 'ci', 'nombre', 'ap_paterno', 'ap_materno', 'fecha_nacimiento', 'NombreClub', 'edad', 'documento', 'edit'];
  dataSource: any;
  dataClub: any = [];
  responseMessage: any;
  role: any;

  //----url del servidor backend
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL = this.url + '/uploads/img/';

  apiResponse: any = []; //para filtrar con el select
 
  //-----PARA REPORTES
  userName: string = '';

  constructor(private jugadorService: JugadorService,
    private clubService: ClubService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router) {

  }




  ngOnInit(): void {
    this.tableData();
    this.getClub();

    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token y extraer el nombre
      const decodedToken: any = jwt_decode(token);
      this.role = decodedToken?.role || 'Rol desconocido';
      this.userName = decodedToken?.nombre || 'Usuario desconocido';
      
      console.log('Rol:', this.role);
    } else {
      console.log('No hay token en localStorage');
    }

    this.displayedColumns = this.role === 'user' 
      ? ['numero', 'foto', 'ci', 'nombre', 'ap_paterno', 'ap_materno', 'fecha_nacimiento', 'NombreClub', 'edad', 'documento']  // Agrega las columnas que sí pueden ver los usuarios "user"
      : ['numero', 'foto', 'ci', 'nombre', 'ap_paterno', 'ap_materno', 'fecha_nacimiento', 'NombreClub', 'edad', 'documento', 'edit'];
  
  }

  craatePdf() {
    const fecha = new Date();
    const pdfDefinition: any = {

      header: {
        margin: 20,
        alignment: "center",
        columns: [
          'INTEGRACION YARETANENSE'
        ]
      },

      footer: {
        margin: 10,
        columns: [
          'USUARIO: Rocio Poma silvestre',
          { text: fecha, alignment: 'right' }
        ]
      },

      content: [
        {
          text: 'Reporte de Jugadores'
        },
        {

          // you'll most often use dataURI images on the browser side
          // if no width/height/fit is provided, the original size will be used
          // image: '../../../assets/img/futbol.jpg'
        }
        //{ stack: htmlToPdfmake(this.apiResponse) },
      ]
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  //----------------------- LISTA  JUGADORES--------------------------------
  tableData() {
    this.jugadorService.getJugadors().subscribe((response: any) => {
      this.ngxService.stop();
      this.apiResponse = response;
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

  //----------------------- LISTA  CLUBS--------------------------------
  getClub() {
    this.clubService.getClubs().subscribe((response: any) => {
      this.dataClub = response;
    })
  }

  //---------------------------------Fitrador----------------------------------------------------
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  filterSelection($event: any) {
    let filterData = _.filter(this.apiResponse, (item) => {
      return item.NombreClub.toLowerCase() == $event.value.toLowerCase();
    })
    if ($event.value == 'Todos') {
      this.tableData();
    } else {
      this.dataSource = new MatTableDataSource(filterData);
    }
  }


  //-----------------REPORTE
  /* generatePDF() {
     // Crear una instancia de jsPDF
     const doc = new jsPDF();
 
     // Obtener los datos filtrados
     const filteredData = this.dataSource.filteredData;
 
     // Crear un objeto de imagen y cargar la imagen desde una URL
     const logoImg = new Image();
     logoImg.src = 'https://example.com/logo.png'; // URL de la imagen
 
 
     doc.text('Reporte de Jugadores', 70, 20);
 
     // Definir las columnas y las filas para la tabla en el PDF
     const columns = ['Nro', 'ci', 'nombre', 'ap_paterno', 'ap_materno', 'edad', 'NombreClub']; // Nombres de las columnas
 
     // Mapear los datos filtrados para agregar el índice de numeración
     const rows = filteredData.map((item, index) => [
       index + 1,       // Añadir el índice +1 para que la numeración comience en 1
       item.ci,         // Documento de Identidad
       item.nombre,     // Nombre
       item.ap_paterno, // Apellido Paterno
       item.ap_materno, // Apellido Materno
       item.edad,       // Edad
       item.NombreClub  // Club
     ]);
 
     // Agregar la tabla al PDF usando autoTable
     (doc as any).autoTable({
       head: [columns],
       body: rows,
       startY: 30, // Ajusta la posición de inicio de la tabla
       theme: 'striped'
     });
 
     // Agregar el pie de página con el usuario y la fecha
     const date = new Date().toLocaleString();
     doc.setFontSize(10);
     doc.text(`Generado por: ${this.userName}`, 10, doc.internal.pageSize.getHeight() - 10);
     doc.text(`Fecha: ${date}`, 150, doc.internal.pageSize.getHeight() - 10);
 
     // Guardar el PDF
     doc.save('reporte.pdf');
   }*/
  //-------------FIN REPORTE

  generatePDF() {
    const doc = new jsPDF();

    // Obtener los datos filtrados
    const filteredData = this.dataSource.filteredData;

    // Cargar la imagen del logo desde la carpeta de assets
    const logoImg = new Image();
    logoImg.src = '../../../assets/img/logo2_1.png'; // Ruta de la imagen en tu proyecto

    logoImg.onload = () => {
      
      // Agregar el encabezado con el logo, usuario y fecha
      doc.addImage(logoImg, 'PNG', 150, 5, 40, 20);// Ajusta la posición y tamaño según sea necesario
      doc.setFontSize(12);
      doc.text('REPORTE JUGADORES', 75, 25);

      const date = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado por: ${this.userName}`, 15, 15);
      doc.text(`Fecha: ${date}`, 15, 20);

      // Función para agregar encabezado y pie de página en cada página
      const addHeaderAndFooter = () => {

        // Agregar numeración de página en el pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`Página ${i}`, 100, doc.internal.pageSize.getHeight() - 10);
        }
      };

      // Agregar el encabezado antes de crear la tabla
      addHeaderAndFooter();

      // Definir las columnas para la tabla
      const columns = ['Nº', 'CI', 'Nombre', 'Apellido Paterno', 'Apellido Materno', 'Edad', 'Club'];

      // Mapear los datos filtrados para agregar el índice de numeración
      const rows = filteredData.map((item, index) => [
        index + 1,
        item.ci,
        item.nombre,
        item.ap_paterno,
        item.ap_materno,
        item.edad,
        item.NombreClub
      ]);

      // Agregar la tabla al PDF usando autoTable
      (doc as any).autoTable({
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
      doc.save('REPORTE JUGADORES IYT'+'.pdf');
    };
  }




  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(JugadorComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddJugador.subscribe((response) => {
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
    const dialogRef = this.dialog.open(JugadorComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditJugador.subscribe((response) => {
      this.tableData();
    })
  }
  handleUploadFile(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'file',
      data: values
    }
    dialogConfig.width = "600px";
    const dialogRef = this.dialog.open(JugadorComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditJugador.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar a el/la ' + ' deportista ' + values.nombre + ' ' + values.ap_paterno
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteJugador(values.ci);
      dialogRef.close();
    });
  }

  deleteJugador(ci: any) {
    this.jugadorService.delete(ci).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  onChange(status: any, ci: any) {
    var data = {
      status: status.toString(),
      ci: ci
    }
    this.jugadorService.updateStatus(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }


}
