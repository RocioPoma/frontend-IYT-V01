import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuspiciadorService } from 'src/app/servicios/auspiciador.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-auspiciador',
  templateUrl: './auspiciador.component.html',
  styleUrls: ['./auspiciador.component.scss']
})
export class AuspiciadorComponent implements OnInit {
  onAddCategoria = new EventEmitter();
  onEditCategoria = new EventEmitter();
  categoriaForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Añadir";
  responseMessage: any;
  tipo: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private auspiciadorService: AuspiciadorService,
    private dialogRef: MatDialogRef<AuspiciadorComponent>,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.categoriaForm = this.formBuilder.group({
      tipo:[null, Validators.required],
      nit:[null],
      ci:[null],
      nombre: [null, Validators.required],
      ap_paterno:[null],
      ap_materno:[null],
      sitio:[null, Validators.required],
      telefono:[null, Validators.required],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.tipo=this.dialogData.data.tipo;
      this.categoriaForm.patchValue(this.dialogData.data);
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
    var formData = this.categoriaForm.value;
    var data = {
      tipo:formData.tipo,
      nit:formData.nit,
      ci:formData.ci,
      nombre: formData.nombre,
      ap_paterno:formData.ap_paterno,
      ap_materno:formData.ap_materno,
      sitio:formData.sitio,
      telefono:formData.telefono,
    }
    this.auspiciadorService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddCategoria.emit();
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
    var formData = this.categoriaForm.value;
    var data = {
      id_ausp: this.dialogData.data.id_ausp,
      nit:formData.nit,
      ci:formData.ci,
      nombre: formData.nombre,
      ap_paterno:formData.ap_paterno,
      ap_materno:formData.ap_materno,
      sitio:formData.sitio,
      telefono:formData.telefono,
    }
    this.auspiciadorService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditCategoria.emit();
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


  //-----------Para el tipo
  changeSelectTipo(tipo:any){
    if (this.dialogAction === 'Edit') {
      this.tipo = this.dialogData.data.tipo;
    }
    else {
      this.tipo = tipo;
    }
    
  }

}
