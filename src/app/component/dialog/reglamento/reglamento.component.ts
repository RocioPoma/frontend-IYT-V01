import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReglamentoService } from 'src/app/servicios/reglamento.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reglamento',
  templateUrl: './reglamento.component.html',
  styleUrls: ['./reglamento.component.scss']
})
export class ReglamentoComponent implements OnInit {
  onAddCampeonato = new EventEmitter();
  onEditCampeonato = new EventEmitter();
  reglamentoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Añadir";
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
    private reglamentoService: ReglamentoService,
    private dialogRef: MatDialogRef<ReglamentoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.reglamentoForm = this.formBuilder.group({
      nombre: [null, Validators.required],
      documento: [null]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.reglamentoForm.patchValue(this.dialogData.data);
    }
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

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
  }

  add() {
    var formData = this.reglamentoForm.value;
    console.log(formData);
    var data = {
      nombre: formData.nombre,
    }
    this.reglamentoService.add(data, this.file).subscribe((response: any) => {
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
    var formData = this.reglamentoForm.value;
    var data = {
      id: this.dialogData.data.id,
      nombre: formData.nombre,
      nombredoc: this.dialogData.data.documento,
    }
    this.reglamentoService.update(data, this.file).subscribe((response: any) => {
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
