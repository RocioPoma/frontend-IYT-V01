import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { CampeonatoComponent } from '../dialog/campeonato/campeonato.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

import { DateAdapter } from '@angular/material/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-campeonato',
  templateUrl: './manage-campeonato.component.html',
  styleUrls: ['./manage-campeonato.component.scss']
})
export class ManageCampeonatoComponent implements OnInit {
  displayedColumns: string[] = ['nombre_campeonato', 'gestion', 'fecha_inicio', 'fecha_fin', 'convocatoria', 'acciones', 'administrar'];
  dataSource: any; //almacena los tatos extraidos del backend
  responseMessage: any;

  //----url del servidor backend
  url = environment.apiUrl;
  //----creamos la url para las imagenes
  imgURL = this.url + '/uploads/img/';

  constructor(private campeonatoService: CampeonatoService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {

    this.ngxService.start();
    console.log("url: " + this.imgURL);
    this.tableData();
  }

  tableData() {
    this.campeonatoService.getCampeonato().subscribe((response: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
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
    const dialogRef = this.dialog.open(CampeonatoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCampeonato.subscribe((response) => {
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
    const dialogRef = this.dialog.open(CampeonatoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCampeonato.subscribe((response) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar ' + values.nombre_campeonato + ' de la Gestion ' + values.gestion
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.ngxService.start();
      this.deleteCampeonato(values.id);
      dialogRef.close();
    });
  }

  deleteCampeonato(id: any) {
    this.campeonatoService.delete(id).subscribe((response: any) => {
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

  onChange(status: any, id: any) {
    var data = {
      status: status.toString(),
      id: id
    }
    this.campeonatoService.updateStatus(data).subscribe((response: any) => {
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

  //------------------------- ADMINISTRAR CAMPEONATO ------------------------
  handleAction(values: any) {
    this.campeonatoService.campeonatoEmiter.emit({ data: values.id});
    this.router.navigate(['/integracion/dcampeonato',values.id]);
    /*
    //Mostrar y ocultar parte de la vista

    document.getElementById('contenido_camp')!.style.display = 'none';
    document.getElementById('id-detalle-camp')!.style.display='block';

    //emitimos datos
    this.campeonatoService.campeonatoEmiter.emit({ data: 1, datosCampeonato: values });
    */

    /*
     console.log('VALORES:'+values)
     this.campeonatoService.disparador.emit({data:1,idCampeonato:values.id});
     this.router.navigate(['/integracion/dcampeonato']);
     */
    // console.log('VALORES:'+values)
    //this.router.navigate(['/integracion/dcampeonato']);

    // this.campeonatoService.obtenerCampeonato(values);
    //this.router.navigate(['/integracion/dcampeonato']);
  }
}
