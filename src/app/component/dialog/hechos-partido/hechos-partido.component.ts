import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { DpartidoService } from 'src/app/servicios/dpartido.service';
import { EquipoJugadorService } from 'src/app/servicios/equipo-jugador.service';
import { HechospartidoService } from 'src/app/servicios/hechospartido.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';


@Component({
  selector: 'app-hechos-partido',
  templateUrl: './hechos-partido.component.html',
  styleUrls: ['./hechos-partido.component.scss']
})
export class HechosPartidoComponent implements OnInit {
  displayedColumnsCheck: string[] = ['nombre'];
  displayedColumns: string[] = ['numero', 'nombre', 'edad'];
  action: any = "Agregar";
  dataSource: any;
  dataEquipoJugador: any;
  dataContempla: any;
  equipoJugadorEnCancha: any;
  equipoJugadorEnBanca: any;
  totalEnCancha: any;

  onAdd = new EventEmitter();
  //-----------FORMULARIOS-----------
  equipoJugadorForm: any = FormGroup;
  partidoForm: any = FormGroup;
  hechoPartidoForm: any = FormGroup;

  responseMessage: any;

  jugador: any;

  //--------variables
  id_equipo: any;
  id_partido: any;
  id_contempla: any;
  id_hecho: any;
  hecho: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private hechosPartidoService: HechospartidoService,
    private equipoJugadorService: EquipoJugadorService,
    private partidoService: DpartidoService,
    private categoriaCampeonatoService: DcategoriacampeonatoService,
    private formBuilder: FormBuilder,
    //private jugadorService: JugadorService,
    private dialogRef: MatDialogRef<HechosPartidoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    if (this.dialogData.action === 'addHechos') {
      this.id_equipo = this.dialogData.id_equipo;
      this.id_partido = this.dialogData.id_partido;
      this.id_contempla = this.dialogData.id_contempla;
      this.hecho = (this.dialogData.hecho).toUpperCase();
      this.id_hecho=this.dialogData.id_hecho;
      // this.action = (this.dialogData.data_equipo.nombre_club).toUpperCase(); 
      console.log('id partido ' + this.dialogData.id_partido);
      console.log('id equipo ' + this.id_equipo);
      console.log('id contempla' + this.id_contempla);
    }

    if (this.hecho == 'RESULTADO') {
      this.partidoForm = this.formBuilder.group({
        total_equipo1: [null, Validators.required],
        total_equipo2: [null, Validators.required],
        //foto: [null],
      });
    }else if (this.hecho == 'CAMBIO') {
      this.equipoJugadorForm = this.formBuilder.group({
        ci_jugador1: [null, Validators.required],
        ci_jugador2: [null, Validators.required],
        //foto: [null],
      });
    }else{
      this.hechoPartidoForm = this.formBuilder.group({
        ci: [null, Validators.required],
        id_time: [null, Validators.required],
        descripcion_hecho: [null],
      });
    }


    this.getEquipoJugador();
    this.getEquipoJugadorEnCancha();
    this.getEquipoJugadorEnBanca();
    this.comprobarNumeroDeJugadores();
    this.getContempla();
    
  }


  getContempla(){
    this.categoriaCampeonatoService.getById(this.id_contempla).subscribe((response: any) => {
      this.dataContempla = response;
      console.log("Datos Contempla " + JSON.stringify(this.dataContempla))
    });
  }
  //---------------------LISTA DE JUGADORES DE UN EQUIPO -----------------------------------------
  getEquipoJugador() {
    this.equipoJugadorService.get(this.id_equipo, this.id_contempla).subscribe((response: any) => {
      this.dataEquipoJugador = response;
     // console.log("Datos Equipo Jugador " + JSON.stringify(this.dataEquipoJugador))
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO EN CANCHA -----------------------------------------
  getEquipoJugadorEnCancha() {
    this.equipoJugadorService.getJugadorEnCancha(this.id_equipo, this.id_contempla).subscribe((response: any) => {
      this.equipoJugadorEnCancha = response;
      //console.log("Datos Equipo Jugador en Cancha " + JSON.stringify(this.equipoJugadorEnCancha))
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO EN BANCA -----------------------------------------
  getEquipoJugadorEnBanca() {
    this.equipoJugadorService.getJugadorEnBanca(this.id_equipo, this.id_contempla).subscribe((response: any) => {
      this.equipoJugadorEnBanca = response;
      //console.log("Datos Equipo Jugador en Banca " + JSON.stringify(this.equipoJugadorEnBanca))
    });
  }



  //------------------------------------------------------------------------------------------------
  handleSubmit() {
    if (this.hecho == 'RESULTADO') {
      this.actualizarResultadoPartido();
    } else if(this.hecho=='CAMBIO') {
      this.dialogRef.close();
      this.onAdd.emit();
      this.responseMessage = 'Datos guardado correctamente';
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }else{
      this.addHecho();
    }

  }

  //--------- AGREGAR RESULTADO FINAL PARTIDO DE FORMA DIRECTA --------
  actualizarResultadoPartido() {
    var formData = this.partidoForm.value;
    var data = {
      id_partido: this.id_partido,
      total_equipo1: formData.total_equipo1,
      total_equipo2: formData.total_equipo2
    }
    this.partidoService.updateResultadoPartidos(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAdd.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.dialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }

  //---------- CAMBIO DE JUGADOR --------------- 
  cambioJugador(ci: any, estado: any) {
    //
    if (estado == 'true') {
      estado = 'false';
    } else if (estado == 'false') {
      estado = 'true';
    }
    var data = {
      estado: estado,
      id_club: this.id_equipo,
      id_contempla: this.id_contempla,
      ci: ci,
    }
    this.equipoJugadorService.updateEstado(data).subscribe((response: any) => {
      console.log("ACTUALIZADO CORRECTAMENTE");
      this.onAdd.emit();
      //this.getEquipoJugador();
      //this. getEquipoJugadorEnCancha();
    })

  }

  /*
  handleSubmitCambio(){
    var formData = this.equipoJugadorForm.value;
    var estado='false';
    var data = {
      estado:estado,
      id_club: this.id_equipo,
      id_contempla: this.id_contempla,
      ci: ci,
    }
    this.equipoJugadorService.update1(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditJugador.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.dialogRef.close();
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
  //---------- ACTUALIZAR ESTADO EQUIPO JUGADOR 
  updateEstadoJugador(checked: any, ci: any) {
    let estado = 'false'; //
   
    if (checked) {
      this.comprobarNumeroDeJugadores();
      console.log("TOTAL EN CANCHA"+this.totalEnCancha[0].en_cancha);
     
     
        if (this.totalEnCancha[0].en_cancha == 2) {
          this.responseMessage = 'Se alcanzo el limite máximo de jugadores en cancha';
          this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
        }
      
      
      else{
        estado = 'true';
      }
    }
    var data = {
      estado: estado,
      id_club: this.id_equipo,
      id_contempla: this.id_contempla,
      ci: ci,
    }
    this.equipoJugadorService.updateEstado(data).subscribe((response: any) => {
      console.log("ACTUALIZADO CORRECTAMENTE");
      this.onAdd.emit();
      this.getEquipoJugador();
      this.getEquipoJugadorEnCancha();
    })

  }

    //------------------ OPTENER NUMERO DE JUGADORES EN CANCHA ---------------------------------
    comprobarNumeroDeJugadores() {
      this.equipoJugadorService.getTotalEnCancha(this.id_equipo, this.id_contempla).subscribe((response: any) => {
        this.totalEnCancha = response;
        //console.log("Datos Equipo Jugador en Cancha " + JSON.stringify(this.equipoJugadorEnCanchaE1))
      });
    }
  //--------------------------------------- HECHOS ---------------------------------------------------
  //--------------------------------------------------------------------------------------------------

  //--------- AGREGAR RESULTADO FINAL PARTIDO DE FORMA DIRECTA --------
  addHecho() {
    var formData = this.hechoPartidoForm.value;
    var data = {
      id_partido: this.id_partido,
      ci: formData.ci,
      id_club:this.id_equipo,
      id_contempla:this.id_contempla,
      id_hecho:this.id_hecho,
      id_time:formData.id_time,
      descripcion_hecho: formData.descripcion_hecho
    }
    console.log(data);
    this.hechosPartidoService.add(data).subscribe((response: any) => {
      console.log("entro a add hecho")
      this.dialogRef.close();
      this.onAdd.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
      this.dialogRef.close();
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
