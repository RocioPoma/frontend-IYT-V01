import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { DcategoriaCampeonatoComponent } from '../dialog/dcategoria-campeonato/dcategoria-campeonato.component';

@Component({
  selector: 'app-manage-dcategoria-campeonato',
  templateUrl: './manage-dcategoria-campeonato.component.html',
  styleUrls: ['./manage-dcategoria-campeonato.component.scss']
})
export class ManageDcategoriaCampeonatoComponent implements OnInit {
  dataSource: any = [];
  responseMessage: any;
  arraycamp: any = [];
  id: string | null = ''; //Id Campeonato

  imgURL = '../../../assets/img/deportes/';
  extension = '.jpg';

  constructor(private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private campeonatoService: CampeonatoService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataTable(this.id);
    this.datosCampeonato(this.id);
  }

  //---------------------LISTA DISC, CAT DE UN CAMPEONATO ESPECIFICO  -------------
  dataTable(id: any) {
    this.dcategoriacampeonatoService.get(id).subscribe(res => {
      this.dataSource = res;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      id_campeonato: this.id
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(DcategoriaCampeonatoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAdd.subscribe((response) => {
      this.dataTable(this.id);
    })
  }


  handleEditAction(values: any) {
    console.log("values discat: " + JSON.stringify(values));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
      id_campeonato: this.id
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(DcategoriaCampeonatoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEdit.subscribe((response) => {
      this.dataTable(this.id);
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar ' + values.nombre_disciplina.toUpperCase()+ ' ' + values.nombre_categoria.toUpperCase(),
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any) {
    this.dcategoriacampeonatoService.delete(id).subscribe((response: any) => {
      this.dataTable(this.id);
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


  onChange(status: any, id: any) {
    var data = {
      status: status.toString(),
      id: id
    }
    this.dcategoriacampeonatoService.updateStatus(data).subscribe((response: any) => {
      this.dataTable(this.id);
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

   //------------------------- ADMINISTRAR DETALLE CATEGORIA ------------------------
   handleDetalleAction(values: any) {
    //pasamos id_campeonato y Id de categoria(Tabla contempla)
    this.router.navigate(['/integracion/dcategoria_f',this.id,values.id]);
    //this.campeonatoService.campeonatoEmiter.emit({ data: values.id});
   }

}
