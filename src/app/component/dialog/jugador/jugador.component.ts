import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClubService } from 'src/app/servicios/club.service';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common'

import { environment } from 'src/environments/environment';

interface HtmlInputEvent extends Event {
  target: HTMLFormElement & EventTarget;
}

@Component({
  selector: 'app-jugador',
  templateUrl: './jugador.component.html',
  styleUrls: ['./jugador.component.scss']
})
export class JugadorComponent implements OnInit {
  onAddJugador = new EventEmitter();
  onEditJugador = new EventEmitter();
  jugadorForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;
  club: any = [];

  file!: File;
  photoSelected!: ArrayBuffer | string | null;

  //----url del servidor backend 
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL2 = this.url + '/uploads/img/';

  imgURL = '../../../../assets/img/img.jpg';
  image = '';

  sexo = ['Femenino', 'Masculino'];
  decendencia = ['Neto', 'Yern@', 'Nieto'];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private jugadorService: JugadorService,
    private dialogRef: MatDialogRef<JugadorComponent>,
    private clubService: ClubService,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.jugadorForm = this.formBuilder.group({
      ci: [null, Validators.required],
      nombre: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      ap_paterno: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      ap_materno: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      fecha_nacimiento: [null, Validators.required],
      sexo: [null, Validators.required],
      decendencia: [null, Validators.required],
      clubId: [null, Validators.required],
      fecha_habilitacion: [null],
      //foto: [null],
    });
    if (this.dialogData.action === 'Edit') {
      console.log("llego a edit");
      if (this.dialogData.data.foto != '') {
        this.imgURL = this.imgURL2 + this.dialogData.data.foto;
      }
      console.log('DATOS EDIT: ' + this.imgURL);
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      console.log('datos dialog '+ JSON.stringify(this.dialogData.data));
      this.jugadorForm.patchValue(this.dialogData.data);
    }
    this.getClubs();
  }

  //------------------- OBTENEMOS LOS CLUBS
  getClubs() {
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


  //--------------------------- SELECCIONAMOS IMAGEN PARA MOSTRARLO EN EL MODAL ------------------
  selectFile(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      //image preview
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);
    }
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
    /*
    var formData = this.jugadorForm.value;
    console.log(formData);
    var data = {
      // foto:formData.append('file', this.image),
      ci: formData.ci,
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      decendencia: formData.decendencia,
      clubId: formData.clubId,
      fecha_habilitacion: Date.now(),
    }
    this.jugadorService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddJugador.emit();
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
    })*/
    var formData = this.jugadorForm.value;
    console.log(formData);

    var data = {
      ci: formData.ci,
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      decendencia: formData.decendencia,
      clubId: formData.clubId,
      fecha_habilitacion: Date.now(),
    }

    this.jugadorService.add1(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddJugador.emit();
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

    /*
    var formData = this.jugadorForm.value;
    console.log("Fecha de Nacimiento "+formData.fecha_nacimiento);
    console.log(this.file);

    this.jugadorService.add1(formData.ci,formData.nombre.toUpperCase(),formData.ap_paterno,formData.ap_materno,
    formData.fecha_nacimiento,formData.sexo,formData.decendencia,formData.clubId,formData.fecha_habilitacion, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddJugador.emit();
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
    })*/
  }


  //---------------------------------Editar--------------------------------------------------------
  edit() {
    var formData = this.jugadorForm.value;
    var data = {
      ci: this.dialogData.data.ci,
      ci_mod: formData.ci,
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      fecha_nacimiento: formData.fecha_nacimiento,
      sexo: formData.sexo,
      decendencia: formData.decendencia,
      clubId: formData.clubId,
      nombreimg:this.dialogData.data.foto
    }
    this.jugadorService.update1(data, this.file).subscribe((response: any) => {
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

   //---------------------------------Editar--------------------------------------------------------
   subirDocumentacion() {
    //var formData = this.jugadorForm.value;
    var data = {
      ci: this.dialogData.data.ci
    }
    this.jugadorService.subirDocumetos(data, this.file).subscribe((response: any) => {
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


}
