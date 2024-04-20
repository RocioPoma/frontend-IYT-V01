import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Console } from 'console';
import { NoticiaService } from 'src/app/servicios/noticia.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaComponent implements OnInit {
  onAddNoticia = new EventEmitter();
  onEditNoticia = new EventEmitter();
  noticiaForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Agregar";
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
    private noticiaService: NoticiaService,
    private dialogRef: MatDialogRef<NoticiaComponent>,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }


  ngOnInit(): void {
    this.noticiaForm = this.formBuilder.group({
      //foto: [null],
      titulo: [null, [Validators.required]],
      descripcion: [null, Validators.required],
      imagen: [null],

    });
    if (this.dialogData.action === 'Edit') {
      if(this.dialogData.data.imagen!=''){
        this.imgURL=this.imgURL2+this.dialogData.data.imagen;
      }
      console.log('DATOS EDIT: '+this.imgURL);
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.noticiaForm.patchValue(this.dialogData.data);
    }
  }

  selectImage(event: any): any {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
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
    var formData = this.noticiaForm.value;
    console.log(formData);
    console.log(this.file); 
    var data = {
      titulo: formData.titulo.toUpperCase(),
      descripcion: formData.descripcion,
      id_campeonato: this.dialogData.id_campeonato
    }

    this.noticiaService.add(data, this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddNoticia.emit();
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

  edit() {
    var formData = this.noticiaForm.value;
    var data = {
      id: this.dialogData.data.id,
      titulo:formData.titulo.toUpperCase(),
      descripcion: formData.descripcion,
      nombreimg:this.dialogData.data.imagen,
      id_campeonato: this.dialogData.id_campeonato
    }
    
    this.noticiaService.update(data,this.file).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditNoticia.emit();
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

    /*var formData = this.noticiaForm.value;
    console.log('DAtos form data: ' + this.dialogData.data.imagen);
    var data = {
      id: this.dialogData.data.id,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
    }
    this.noticiaService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditNoticia.emit();
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
    */
  }
}
