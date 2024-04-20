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
//import { jsPDF } from "./jspdf";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonsts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonsts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-manage-jugador',
  templateUrl: './manage-jugador.component.html',
  styleUrls: ['./manage-jugador.component.scss']
})
export class ManageJugadorComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'foto', 'ci', 'nombre', 'ap_paterno', 'ap_materno', 'fecha_nacimiento', 'NombreClub', 'edad','documento', 'edit'];
  dataSource: any;
  dataClub: any = [];
  responseMessage: any;

  //----url del servidor backend
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL = this.url + '/uploads/img/';

  apiResponse: any = []; //para filtrar con el select
  //imgreporte='../../../assets/img/futbol.jpg';
 // imgreporte="https://drive.google.com/file/d/1M-lypmUu2C-HeMZSd0VBANQkxdjHBSP7/view?usp=share_link"

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
    //this.downloadPDF();
  }

  craatePdf() {
    const fecha = new Date();
    const pdfDefinition: any = {

      header:{
        margin: 20,
        alignment: "center",
        columns:[
          'INTEGRACION YARETANENSE'
        ]
      } ,

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
