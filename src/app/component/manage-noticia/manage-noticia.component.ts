import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NoticiaService } from 'src/app/servicios/noticia.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { NoticiaComponent } from '../dialog/noticia/noticia.component';
import { Noticia } from '../../model/noticia.model'
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

import { environment } from 'src/environments/environment';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';

@Component({
  selector: 'app-manage-noticia',
  templateUrl: './manage-noticia.component.html',
  styleUrls: ['./manage-noticia.component.scss']
})
export class ManageNoticiaComponent implements OnInit {
  displayedColumns: string[] = ['titulo', 'descripcion', 'imagen'];

  //----url del servidor backend
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL = this.url + '/uploads/img/';

  // noticias: Noticia[] = [];
  datosNoticia: any = [];
  arraycamp: any = [];
  responseMessage: any;
  id: string | null = '';

  constructor(private noticiaService: NoticiaService,
    private campeonatoService: CampeonatoService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.datosNoticiaCampeonato(this.id);
    this.datosCampeonato(this.id);
    // this.tableData();
  }

  //---------------------LISTA NOTICIAS DE UN CAMPEONATO ESPECIFICO  -------------
  datosNoticiaCampeonato(id: any) {
    this.noticiaService.getNoticiaCampeonato(id).subscribe(res => {
      this.datosNoticia = res;
    },
      err => console.log(err)
    )
  }
  //---------------------OBTENEMOS DATOS CAMPEONATO
  datosCampeonato(id: any) {
    this.campeonatoService.getByIdc(id).subscribe(res => {
      this.arraycamp = res;
      //console.log("datos RES: " + JSON.stringify(this.arraycamp));
    },
      err => console.log(err)
    )
  }

  //----------------------LISTA TODAS LAS NOTICIAS--------------------------------
  tableData() {
    this.noticiaService.getNoticias().subscribe(res => {
      this.datosNoticia = res;
    },
      err => console.log(err)
    )
    /*
    this.noticiaService.getNoticias().subscribe((response: any) => {
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
    })*/
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      id_campeonato: this.id
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(NoticiaComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddNoticia.subscribe((response) => {
      this.datosNoticiaCampeonato(this.id);
    })
  }

  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    console.log('imagen: ' + values.imagen)
    dialogConfig.data = {
      action: 'Edit',
      data: values,
      id_campeonato: this.id
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(NoticiaComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditNoticia.subscribe((response) => {
      this.datosNoticiaCampeonato(this.id);
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar la ' + ' noticia' + values.titulo
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteNoticia(values.id);
      dialogRef.close();
    });
  }

  deleteNoticia(id: any) {
    this.noticiaService.delete(id).subscribe((response: any) => {
      this.datosNoticiaCampeonato(this.id);
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

}
