import { ThisReceiver } from '@angular/compiler';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DpartidoService } from 'src/app/servicios/dpartido.service';
import { EquipoJugadorService } from 'src/app/servicios/equipo-jugador.service';
import { HechospartidoService } from 'src/app/servicios/hechospartido.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { HechosPartidoComponent } from '../hechos-partido/hechos-partido.component';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.scss']
})
export class PartidoComponent implements OnInit {
  displayedColumnsCheck: string[] = ['nombre'];
  displayedColumns: string[] = ['numero', 'nombre', 'edad'];
  displayedColumnsHechos: string[] = ['camiseta', 'nombre', 'hecho'];
  action: any = "Agregar";
  dataPartido: any;
  dataEquipoJugador: any;

  //para equipo1
  equipoJugadorEnCanchaE1: any;
  equipoJugadorEnBancaE1: any;
  hechoGolE1: any;
  hechoFaltaE1: any;
  hechoTarjetaAmarillaE1: any;
  hechoTarjetaRojaE1: any;
  totalGolesE1: any;
  totalGolesOldE1: any;

  //para equipo2
  equipoJugadorEnCanchaE2: any;
  equipoJugadorEnBancaE2: any;
  hechoGolE2: any;
  hechoFaltaE2: any;
  hechoTarjetaAmarillaE2: any;
  hechoTarjetaRojaE2: any;
  totalGolesE2: any;
  totalGolesOldE2: any;


  onAdd = new EventEmitter();
  //onEdit = new EventEmitter();
  equipoForm: any = FormGroup;
  responseMessage: any;

  jugador: any;

  //----variables
  id_partido: any;
  id_equipo1: any;
  id_equipo2: any;
  id_contempla: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private hechosPartido: HechospartidoService,
    private equipoJugadorService: EquipoJugadorService,
    private partidoService: DpartidoService,
    private dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    //private jugadorService: JugadorService,
    private dialogRef: MatDialogRef<PartidoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    //this.getEquipoJugador();
    this.id_partido = this.dialogData.id_partido;
    this.getPartido();
    this.id_contempla = this.dialogData.id_contempla;

    if (this.dialogData.action === 'addHechos') {
      console.log('ENTRO')
      this.id_equipo1 = this.dialogData.id_equipo1;
      this.id_equipo2 = this.dialogData.id_equipo2;
      this.id_contempla = this.dialogData.id_contempla;
      // this.action = (this.dialogData.data_equipo.nombre_club).toUpperCase(); 
      console.log('id partido ' + this.dialogData.id_partido);
      console.log('id equipo1 ' + this.dialogData.id_equipo1);
      console.log('id equipo2 ' + this.dialogData.id_equipo2);
    }
    this.getEquipoJugadorEnCanchaE1();
    this.getEquipoJugadorEnBancaE1();
    this.getHechoGolE1();
    this.getHechoFaltaE1();
    this.getHechoTarjetaAmarillaE1();
    this.getHechoTarjetaRojaE1();
    this.totalGolE1();

    this.getEquipoJugadorEnCanchaE2();
    this.getEquipoJugadorEnBancaE2();
    this.getHechoGolE2();
    this.getHechoFaltaE2();
    this.getHechoTarjetaAmarillaE2();
    this.getHechoTarjetaRojaE2();
    this.totalGolE2();


  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO -----------------------------------------
  getPartido() {
    this.partidoService.getPartido(this.id_partido).subscribe((response: any) => {
      this.dataPartido = response;
      console.log("data partido " + JSON.stringify(this.dataPartido))
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO -----------------------------------------
  getEquipoJugador() {
    this.equipoJugadorService.get(this.dialogData.data_equipo.id_club, this.dialogData.data_equipo.id_contempla).subscribe((response: any) => {
      this.dataEquipoJugador = response;
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO EN CANCHA EQUIPO 1-----------------------------------------
  getEquipoJugadorEnCanchaE1() {
    this.equipoJugadorService.getJugadorEnCancha(this.id_equipo1, this.id_contempla).subscribe((response: any) => {
      this.equipoJugadorEnCanchaE1 = response;
      //console.log("Datos Equipo Jugador en Cancha " + JSON.stringify(this.equipoJugadorEnCanchaE1))
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO EN BANCA  EQUIPO 1-----------------------------------------
  getEquipoJugadorEnBancaE1() {
    this.equipoJugadorService.getJugadorEnBanca(this.id_equipo1, this.id_contempla).subscribe((response: any) => {
      this.equipoJugadorEnBancaE1 = response;
    });
  }

  //---------------------LISTA HECHO GOLES DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoGolE1() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo1, this.id_contempla, 1, this.id_partido).subscribe((response: any) => {
      this.hechoGolE1 = response;
      //this.totalGolE1();
    });
  }

  //---------------------LISTA HECHO FALTAS DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoFaltaE1() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo1, this.id_contempla, 4, this.id_partido).subscribe((response: any) => {
      this.hechoFaltaE1 = response;
    });
  }

  //---------------------LISTA TARJETAS AMARILLAS DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoTarjetaAmarillaE1() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo1, this.id_contempla, 2, this.id_partido).subscribe((response: any) => {
      this.hechoTarjetaAmarillaE1 = response;
      console.log("TARJETA A E1" + JSON.stringify(this.hechoTarjetaAmarillaE1))
    });
  }

  //---------------------LISTA TARJETA ROJA DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoTarjetaRojaE1() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo1, this.id_contempla, 3, this.id_partido).subscribe((response: any) => {
      this.hechoTarjetaRojaE1 = response;
    });
  }

  //---------------------LISTA TARJETA ROJA DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  totalGolE1() {

    this.hechosPartido.getTotalGolesPartido(this.id_equipo1, this.id_contempla, this.id_partido).subscribe((response: any) => {
      this.totalGolesOldE1 = this.totalGolesE1;
      this.totalGolesE1 = response;

      console.log("Total go e1 " + JSON.stringify(this.totalGolesE1));
      //return this.totalGolesE1[0].total;
    });
    //console.log("Total GOL E1: " + totalGolE1);
    //return this.totalGolesE1[0].total;
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO EN CANCHA EQUIPO 2-----------------------------------------
  getEquipoJugadorEnCanchaE2() {
    this.equipoJugadorService.getJugadorEnCancha(this.id_equipo2, this.id_contempla).subscribe((response: any) => {
      this.equipoJugadorEnCanchaE2 = response;
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO EN BANCA  EQUIPO 2-----------------------------------------
  getEquipoJugadorEnBancaE2() {
    this.equipoJugadorService.getJugadorEnBanca(this.id_equipo2, this.id_contempla).subscribe((response: any) => {
      this.equipoJugadorEnBancaE2 = response;
    });
  }

  //---------------------LISTA HECHO GOLES DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoGolE2() {
    //console.log("idE2 id_contempla", this.id_equipo2+" "+this.id_contempla);
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo2, this.id_contempla, 1, this.id_partido).subscribe((response: any) => {
      this.hechoGolE2 = response;
      //this.totalGolE2();
    });
  }

  //---------------------LISTA HECHO FALTAS DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoFaltaE2() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo2, this.id_contempla, 4, this.id_partido).subscribe((response: any) => {
      this.hechoFaltaE2 = response;
    });
  }

  //---------------------LISTA TARJETAS AMARILLAS DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoTarjetaAmarillaE2() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo2, this.id_contempla, 2, this.id_partido).subscribe((response: any) => {
      this.hechoTarjetaAmarillaE2 = response;
    });
  }

  //---------------------LISTA TARJETA ROJA DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  getHechoTarjetaRojaE2() {
    this.hechosPartido.getHechosPartidoJugador(this.id_equipo2, this.id_contempla, 3, this.id_partido).subscribe((response: any) => {
      this.hechoTarjetaRojaE2 = response;
    });
  }

  //---------------------LISTA TARJETA ROJA DE UN CLUB Y SUS JUGADORES QUE LO HICIERON-----------------------------------------
  totalGolE2() {
    this.hechosPartido.getTotalGolesPartido(this.id_equipo2, this.id_contempla, this.id_partido).subscribe((response: any) => {
      this.totalGolesOldE2 = this.totalGolesE2;
      this.totalGolesE2 = response;
      console.log("Total go e1 " + JSON.stringify(this.totalGolesE2));
      // return this.totalGolesE2[0].total;
    });
  }



  //------------------------------------------------------------------------------------------------
  handleSubmit(totalE1: any, totalE2: any) {
    this.actualizarResultadoPartido(totalE1, totalE2);
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
      this.equipoJugadorService.add(data).subscribe((response: any) => {
        console.log("AGREGADO CORRECTAMENTE");
        this.getEquipoJugador();
      })
    } else {
      this.equipoJugadorService.delete(data.id_club, data.id_contempla, data.ci).subscribe((response: any) => {
        console.log("ELIMINADO CORRECTAMENTE");
        this.getEquipoJugador();
      })
    }
    console.log("value1: " + checked);
    console.log("value2 " + ci);
  }

  //----------------COMPROBAR SI EL JUGADOR YA ESTA AGREGADO EN EL EQUIPO
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

  //-----------------CAMBIAR ESTADO PARTIDO (CERRADO, NO REALIZADO, EN VIVO)-------------

  changeSelectEstado(estado: any, id_partido: any) { //obtenemos el estado
    console.log("estado: " + estado);
    console.log("id_partido: " + id_partido);
    var data = {
      estado: estado,
      id_partido: id_partido
    }
    this.partidoService.updateStatus(data).subscribe((response: any) => {
      //this.getPartido();
      this.onAdd.emit();
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
    //this.getPartido();
  }

  //-----------------SUBIR HECHOS PARTIDO------------------------------------------------
  handleSubmitHechos(id_equipo: any, hecho: any, id_hecho: any) {
    console.log("id_equipo " + id_equipo)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'addHechos',
      id_partido: this.id_partido,
      id_equipo: id_equipo,
      id_contempla: this.id_contempla,
      hecho: hecho,
      id_hecho: id_hecho
    }
    dialogConfig.width = "600px";
    const dialogRef = this.dialog.open(HechosPartidoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAdd.subscribe((response) => {
      if (hecho == 'gol') {
        this.getHechoGolE1();
        this.getHechoGolE2();
        this.totalGolE1();
        this.totalGolE2();

        //this.actualizarResultadoPartido();
      } else if (hecho == 'falta') {
        this.getHechoFaltaE1();
        this.getHechoFaltaE2();
      } else if (hecho == 'tarjeta amarilla') {
        this.getHechoTarjetaAmarillaE1();
        this.getHechoTarjetaAmarillaE2();
      } else if (hecho == 'tarjeta roja') {
        this.getHechoTarjetaRojaE1();
        this.getHechoTarjetaRojaE2();
      }
      else {
        this.getEquipoJugadorEnCanchaE1();
        this.getEquipoJugadorEnBancaE1();
        this.getEquipoJugadorEnCanchaE2();
        this.getEquipoJugadorEnBancaE2();
      }


    })
  }

  actualizarResultadoPartido(totalE1: any, totalE2: any) {
    // let  totalE1=this.totalGolesE1[0].total;
    // let  totalE2=this.totalGolesE2[0].total;

   // console.log("LLEGO A Resultado Partido Actualizado")
   // console.log("GOLES E1: " + totalE1)
   // console.log("GOLES E2: " + totalE2)
    var data = {
      id_partido: this.id_partido,
      total_equipo1: totalE1,
      total_equipo2: totalE2
    }
    console.log(data)
    this.partidoService.updateResultadoPartidos(data).subscribe((response: any) => {
     // console.log("Resultado Partido Actualizado")
      this.getPartido();
    })
  }

  //------------ PARA AGREGAR DIRECTAMENTE EL RESULTADO  ----------
  addResultado(id_equipo1: any, id_equipo2: any, nombre_equipo1: any, nombre_equipo2: any, hecho: any) {
    console.log("Id eq1: " + id_equipo1 + " id eq2 " + id_equipo2)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'addHechos',
      id_partido: this.id_partido,
      id_contempla: this.id_contempla,
      id_equipo1: id_equipo1,
      id_equipo2: id_equipo2,
      nombre_equipo1: nombre_equipo1,
      nombre_equipo2: nombre_equipo2,
      hecho: hecho
    }
    dialogConfig.width = "500px";
    const dialogRef = this.dialog.open(HechosPartidoComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAdd.subscribe((response) => {
      //this.getPartido();
      this.changeSelectEstado('Cerrado',this.id_partido);
      this.dialogRef.close();
      this.onAdd.emit();
    })
  }
}
