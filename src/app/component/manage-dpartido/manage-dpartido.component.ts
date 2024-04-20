import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from 'src/app/servicios/club.service';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { DpartidoService } from 'src/app/servicios/dpartido.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { PartidoComponent } from '../dialog/partido/partido.component';

export interface PeriodicElement {
  equipo: string;
  puntos: number;
  juegos: number;
  ganados: number;
  empates: number;
  perdido: number;
  golesfavor: number;
  golescontra: number;
  diferenciagoles: number;
  aprovechamiento: number;
  extra: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { equipo: 'Aurora', puntos: 3, juegos: 3, ganados: 1, empates: 1, perdido: 0, golesfavor: 0, golescontra: 0, diferenciagoles: 2, aprovechamiento: 0, extra: 3 },
  { equipo: 'Ingavi', puntos: 3, juegos: 3, ganados: 1, empates: 1, perdido: 0, golesfavor: 0, golescontra: 0, diferenciagoles: 2, aprovechamiento: 0, extra: 3 },
  { equipo: 'Real Maracana', puntos: 3, juegos: 3, ganados: 1, empates: 1, perdido: 0, golesfavor: 0, golescontra: 0, diferenciagoles: 2, aprovechamiento: 0, extra: 3 },
  { equipo: 'Rosario Central', puntos: 3, juegos: 3, ganados: 1, empates: 1, perdido: 0, golesfavor: 0, golescontra: 0, diferenciagoles: 2, aprovechamiento: 0, extra: 3 },
  { equipo: 'Bolivar 2', puntos: 3, juegos: 3, ganados: 1, empates: 1, perdido: 0, golesfavor: 0, golescontra: 0, diferenciagoles: 2, aprovechamiento: 0, extra: 3 },
  { equipo: 'Hydrogen', puntos: 3, juegos: 3, ganados: 1, empates: 1, perdido: 0, golesfavor: 0, golescontra: 0, diferenciagoles: 2, aprovechamiento: 0, extra: 3 },
];

@Component({
  selector: 'app-manage-dpartido',
  templateUrl: './manage-dpartido.component.html',
  styleUrls: ['./manage-dpartido.component.scss']
})
export class ManageDpartidoComponent implements OnInit {
  displayedColumns: string[] = ['numero', 'equipo1', 'vs', 'equipo2'];
  displayedColumnsTP: string[] = ['numero', 'equipos', 'pts', 'j', 'g', 'e', 'p', 'gf', 'gc', 'dif', '%', 'pe'];
  dataSource: any;
  dataSource2: any; //se utiliza cyando es por series
  //dataSourceTP: any;
  dataSourceTP = ELEMENT_DATA;
  responseMessage: any;
  dataFixture: any;
  dataCategoriad: any;

  id: string | null = '';

  constructor(private dpartidoService: DpartidoService,
    private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id_contempla');
    this.dataCategoria(this.id);
    //console.log('DATOS SISTEMA SE JUEGO ' + this.dataCategoriad.sistema_de_juego);
    

    this.tableData();
    this.tableData2();
  }


  tableData() {
    var id_serie = 1
    this.dpartidoService.get(this.id, id_serie).subscribe((response: any) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataFixture = response
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

  tableData2() {
    var id_serie = 2
    this.dpartidoService.get(this.id, id_serie).subscribe((response: any) => {
      this.dataSource2 = new MatTableDataSource(response);
      //this.dataFixture = response
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

  //--------------------- LISTA DISCIPLINA, CATEGORIA .. DE UN CAMPEONATO ESPECIFICO  -------------
  dataCategoria(id: any) {
    this.dcategoriacampeonatoService.getById(id).subscribe(res => {
      this.dataCategoriad = res;
      // console.log("datos RES: " + JSON.stringify(this.dataSource));
    },
      err => console.log(err)
    )
  }

  //--------------------------------- GENERAR FIXTURE ------------------------------------------------------
  handleAddAction() {
    console.log('DATOS SISTEMA SE JUEGO ' + this.dataCategoriad.sistema_de_juego)
    var id_serie = 1;
    var n = 1;
    if (this.dataCategoriad.sistema_de_juego == 'por serie') {
      n = 2;
    }
    for (var i = 1; i <= n; i++) {

      id_serie = i;

      var data = {
        id_contempla: this.id,
        id_serie: id_serie
      }

      this.dpartidoService.addFixture(data).subscribe((response: any) => {
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "success");
        this.tableData();
        this.tableData2();
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


  handleDeleteAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: ' eliminar el presente fixture'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      //this.ngxService.start();
      this.deleteFixture(this.id);
      dialogRef.close();
    });
  }

  deleteFixture(id_contempla: any) {
    this.dpartidoService.deleteFixture(id_contempla).subscribe((response: any) => {
      this.tableData();
      this.tableData2();
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

  //--------COMPROBAR ARRAY DE FIXTURE 

  comprobarArrayFixture() {
    //const estado= false;
    if (JSON.stringify(this.dataFixture) == '[]') {
      return false;
    }
    else {
      return true;
    }
    //console.log("DTAOS FISTURE "+JSON.stringify(this.dataFixture))
    //return false;
  }


  //--------ADMINISTRAR PARTIDO
  hechosPartido(id_partido: any, id_equipo1: any, id_equipo2: any) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'addHechos',
      id_partido: id_partido,
      id_equipo1: id_equipo1,
      id_equipo2: id_equipo2,
      id_contempla: this.id
    }
    dialogConfig.width = "800px";
    const dialogRef = this.dialog.open(PartidoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
  
    });
    const sub = dialogRef.componentInstance.onAdd.subscribe((response) => {
      this.tableData();
      this.tableData2();
    })

    console.log("id partido: " + id_partido);
    console.log("id equipo 1: " + id_equipo1);
    console.log("id equipo 2: " + id_equipo2);
  }


}

/*

handleEditAction(values: any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    action: 'Edit',
    data:values
  }
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(ClubComponent, dialogConfig);
  this.router.events.subscribe(() => {
    dialogRef.close();
  });
  const sub = dialogRef.componentInstance.onEditClub.subscribe((response) => {
    this.tableData();
  })
}

//------------------ LIMINAR CLUB --------------------------------
handleDeleteAction(values: any) {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    message: ' eliminar  el Club ' + values.nombre
  };
  const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
  const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
    this.deleteReglamento(values.id);
    dialogRef.close();
  });
}

deleteReglamento(id: any) {
  this.clubService.delete(id).subscribe((response: any) => {
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
*/


