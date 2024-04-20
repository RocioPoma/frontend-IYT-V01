import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClubService } from 'src/app/servicios/club.service';
import { EquipoService } from 'src/app/servicios/equipo.service';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { SerieService } from 'src/app/servicios/serie.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.scss']
})
export class EquipoComponent implements OnInit {
  onAdd = new EventEmitter();
  onEdit = new EventEmitter();
  equipoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Agregar";
  responseMessage: any;

  club: any = [];
  serie: any = [];
  jugador: any;
  sistema_de_juego: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private equipoService: EquipoService,
    private clubService: ClubService,
    private serieService: SerieService,
    private jugadorService:JugadorService,
    private dialogRef: MatDialogRef<EquipoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.sistema_de_juego=this.dialogData.data_categoria.sistema_de_juego;
    this.equipoForm = this.formBuilder.group({
      id_club: [null, Validators.required],
      id_contempla: [null],
      id_serie: [null],
      numero_sorteo:[null],
      ci_jugador:[null]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      //console.log( this.sistema_de_juego);
      console.log('datos categoria(contempla) '+ JSON.stringify(this.dialogData.data));
      this.equipoForm.patchValue(this.dialogData.data);
      this.changeSelect(this.dialogData.data.id_club);
    }
    this.getClub();
    this.getSerie();
  }

  //------------------- OBTENEMOS LISTA DE CLUBS --------------------------------------------------
  getClub() {
    this.clubService.getClubs().subscribe((response: any) => {
      this.club = response;
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

  //------------------- OBTENEMOS LISTA DE SERIE --------------------------------------------------
  getSerie() {
    this.serieService.getSerie().subscribe((response: any) => {
      this.serie = response;
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


  //------------------------------------------------------------------------------------------------
  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
  }

  //---------------------------------Añadir------------------------------------------------------
  add() {
    var formData = this.equipoForm.value;
    var id_serie=formData.id_serie;
    if(this.sistema_de_juego!='por serie'){
      id_serie=1
    }
    var data = {
      id_club: formData.id_club,
      id_contempla: this.dialogData.id_contempla,
      id_serie: id_serie,
      numero_sorteo: formData.numero_sorteo
    }

    this.equipoService.add(data).subscribe((response: any) => {
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


  //---------------------------------Editar--------------------------------------------------------
  edit() {
    var formData = this.equipoForm.value;
    var id_serie=formData.id_serie;
    if(this.sistema_de_juego!='por serie'){
      id_serie=1
    }
    var data = {
      id_club: this.dialogData.data.id_club,
      id_contempla: this.dialogData.id_contempla,
      id_clubNew: formData.id_club,
      id_serie: id_serie,
      numero_sorteo: formData.numero_sorteo
    }
    this.equipoService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEdit.emit();
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

  //----------------------------------Agregar Equipo --------------------------------- no se utiliza todavia aqui
  changeSelect(idClub:any){ //optenemos id equipo despues de seleccionar
    this.jugadorService.getJugadorByIdClub(idClub).subscribe((response: any) => {
      this.jugador = response;
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

  //---
  showOptions(idClub:any){ 
    
    console.log("Checked: "+idClub);
  }

  makeJSON(value1: any,value2: any){
    console.log("value1: "+value1);
    console.log("value2 "+value2);
  }
}
