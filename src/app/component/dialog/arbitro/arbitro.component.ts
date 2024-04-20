import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArbitroService } from 'src/app/servicios/arbitro.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-arbitro',
  templateUrl: './arbitro.component.html',
  styleUrls: ['./arbitro.component.scss']
})
export class ArbitroComponent implements OnInit {
  onAddArbitro = new EventEmitter();
  onEditArbitro = new EventEmitter();
  arbitroForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Registrar";
  responseMessage: any;


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private arbitroService: ArbitroService,
    private dialogRef: MatDialogRef<ArbitroComponent>,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.arbitroForm = this.formBuilder.group({
      ci: [null, Validators.required],
      nombre: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      ap_paterno: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      ap_materno: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      telefono: [null, Validators.required],
      funcion: [null, Validators.required],
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.arbitroForm.patchValue(this.dialogData.data);
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
    var formData = this.arbitroForm.value;
    console.log(formData);

    var data = {
      ci: formData.ci,
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      telefono: formData.telefono,
      funcion: formData.funcion
    }

    this.arbitroService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddArbitro.emit();
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
    var formData = this.arbitroForm.value;
    var data = {
      ci: this.dialogData.data.ci,
      ci_mod: formData.ci,
      nombre: formData.nombre,
      ap_paterno: formData.ap_paterno,
      ap_materno: formData.ap_materno,
      telefono: formData.telefono,
      funcion: formData.funcion
    }
    this.arbitroService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditArbitro.emit();
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
