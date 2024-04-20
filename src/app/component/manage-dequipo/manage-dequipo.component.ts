import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/servicios/club.service';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { EquipoService } from 'src/app/servicios/equipo.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { EquipoComponent } from '../dialog/equipo/equipo.component';
import { JugadorEquipoComponent } from '../dialog/jugador-equipo/jugador-equipo.component';

@Component({
  selector: 'app-manage-dequipo',
  templateUrl: './manage-dequipo.component.html',
  styleUrls: ['./manage-dequipo.component.scss']
})
export class ManageDequipoComponent implements OnInit {

  dataSource: any = [];
  dataDcategoria: any = []; //para datos de una categoria especifica(Tabla contempla)
  responseMessage: any;
  id_contempla: string | null = ''; //contempla categoria disciplina y campeonato

  imgURL = '../../../assets/img/deportes/';
  extension = '.jpg';

  constructor(private equipoService: EquipoService,
    private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private clubService: ClubService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id_contempla = this.route.snapshot.paramMap.get('id_contempla');
    this.dataTable(this.id_contempla);

    this.dataCategoria(this.id_contempla);
  }

  //---------------------LISTA EQUIPOS QUE PERTENECEN A UNA CATEGORIA ESPECIFICO  -------------
  dataTable(id: any) {
    this.equipoService.get(id).subscribe(res => {
      this.dataSource = res;
    },
      err => console.log(err)
    )
  }

  //

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      data_categoria: this.dataDcategoria,
      id_contempla: this.id_contempla
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(EquipoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAdd.subscribe((response) => {
      this.dataTable(this.id_contempla);
    })
  }


  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: values,
      data_categoria: this.dataDcategoria,
      id_contempla: this.id_contempla
    }
    dialogConfig.width = "700px";
    const dialogRef = this.dialog.open(EquipoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEdit.subscribe((response) => {
      this.dataTable(this.id_contempla);
    })
  }

  handleDeleteAction(values: any) {
    //console.log("Dtaos para eliminar "+JSON.stringify(values))
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar el equipo ' + values.nombre_club.toUpperCase()
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.delete(values.id_club, values.id_contempla);
      dialogRef.close();
    });
  }

  delete(id_club: any,id_contempla:any) {
    this.equipoService.delete(id_club, id_contempla).subscribe((response: any) => {
      this.dataTable(this.id_contempla);
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

   //---------------------LISTA DISCIPLINA, CATEGORIA .. DE UN CAMPEONATO ESPECIFICO  -------------
   dataCategoria(id: any) {
    this.dcategoriacampeonatoService.getById(id).subscribe(res => {
      this.dataDcategoria = res;
    },
      err => console.log(err)
    )
  }

  //------------------------- AGREGAR JUGADORES A UN EQUIPO ------------------------
  handleAddJugador(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'addJugador',
      data_equipo: values,
      id_contempla: this.id_contempla,
      data_categoria: this.dataDcategoria
    }
    dialogConfig.width = "600px";
    const dialogRef = this.dialog.open(JugadorEquipoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEdit.subscribe((response) => {
      this.dataTable(this.id_contempla);
    })
    //this.campeonatoService.campeonatoEmiter.emit({ data: values.id});
    //this.router.navigate(['/integracion/dcategoria_f',this.id,values.id]);
  }

}
