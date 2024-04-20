import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClubService } from 'src/app/servicios/club.service';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { PasejugadorService } from 'src/app/servicios/pasejugador.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pasejugador',
  templateUrl: './pasejugador.component.html',
  styleUrls: ['./pasejugador.component.scss']
})
export class PasejugadorComponent implements OnInit {
  onAddPase = new EventEmitter();
  onEditPase = new EventEmitter();
  paseForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Añadir";
  responseMessage: any;
  file!: File;
  photoSelected!: ArrayBuffer | string | null;
  club: any = [];
  jugador: any = [];
  idClub: any;

  //----url del servidor backend 
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL2 = this.url + '/uploads/img/';

  imgURL = '../../../../assets/img/img.jpg';
  image = '';

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private paseJugadorService: PasejugadorService,
    private jugadorService:JugadorService,
    private clubService: ClubService,
    private dialogRef: MatDialogRef<PasejugadorComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.paseForm = this.formBuilder.group({
      id_club_solicitante: [null, Validators.required],
      id_club_solicitado: [null, Validators.required],
      ci: [null, Validators.required],
      fecha: [null, Validators.required],
      documento: [null]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.paseForm.patchValue(this.dialogData.data);
    }
    this.getClubs();
    this.getJugadores(0);
  }

  //------------------- OBTENEMOS LOS CLUBS --------------
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

  //------------------- OBTENEMOS JUGADORES DE UN CLUBS --------------
  getJugadores(idClub: any) {
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
  //--------------------------- SELECCIONAMOS IMAGEN PARA MOSTRARLO EN EL MODAL ------------------
  selectFile(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.file = (<File>event.target.files[0]);
      //image preview

      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;

      reader.readAsDataURL(this.file);
    }
  }

  obtenerIdClubSolicitado(idClub:any){
    this.idClub=idClub;
  }

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
  }

  add() {
    var formData = this.paseForm.value;
    console.log(formData);
    var data = {
      id_club_solicitante: formData.id_club_solicitante,
      id_club_solicitado: formData.id_club_solicitado,
      ci: formData.ci,
      fecha: formData.fecha
    }
    this.paseJugadorService.add(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddPase.emit();
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
    var formData = this.paseForm.value;
    var data = {
      id_pase: this.dialogData.data.id_pase,
      id_club_solicitante: formData.id_club_solicitante,
      id_club_solicitado: formData.id_club_solicitado,
      ci: formData.ci,
      fecha: formData.fecha,
      nombredoc: this.dialogData.data.documento,
    }
    this.paseJugadorService.update(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditPase.emit();
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
