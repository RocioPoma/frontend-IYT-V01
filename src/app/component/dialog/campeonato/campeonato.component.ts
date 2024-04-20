import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { DateAdapter } from '@angular/material/core';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-campeonato',
  templateUrl: './campeonato.component.html',
  styleUrls: ['./campeonato.component.scss']
})
export class CampeonatoComponent implements OnInit {
  onAddCampeonato = new EventEmitter();
  onEditCampeonato = new EventEmitter();
  campeonatoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Crear";
  responseMessage: any;
  file!: File;
  photoSelected!: ArrayBuffer | string | null;

  //----url del servidor backend 
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL2 = this.url + '/uploads/img/';

  imgURL = '../../../../assets/img/img.jpg';
  image = '';


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private campeonatoService: CampeonatoService,
    private _sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<CampeonatoComponent>,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.campeonatoForm = this.formBuilder.group({
      nombre_campeonato: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      convocatoria: [null],
      gestion: [null, [Validators.required,Validators.minLength(4)]],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.campeonatoForm.patchValue(this.dialogData.data);
    }
  }

  //--------------------------- SELECCIONAMOS ARCHIVO PARA MOSTRARLO EN EL MODAL ------------------
  selectFile(event: any): any {
    this._sanitizer.bypassSecurityTrustStyle(event.target.files);
    if (event.target.files && event.target.files[0]) {
      this.file = (<File>event.target.files[0]);
      //image preview
      
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      
      reader.readAsDataURL(this.file);
    }
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
    var formData = this.campeonatoForm.value;
    console.log(formData);
    var data = { 
      nombre_campeonato: formData.nombre_campeonato,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      convocatoria: formData.convocatoria,
      gestion: formData.gestion,
    }
    this.campeonatoService.add1(data,this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddCampeonato.emit();
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
    var formData = this.campeonatoForm.value;
    var data = {
      id: this.dialogData.data.id,
      nombre_campeonato: formData.nombre_campeonato,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      convocatoria: formData.convocatoria,
      gestion: formData.gestion,
      nombre_conv:this.dialogData.data.convocatoria
    }
    this.campeonatoService.update1(data,this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditCampeonato.emit();
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
