import { ROLES } from 'src/app/shared/permisos';
import { Component, EventEmitter, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../servicios/snackbar.service';
import { UserService } from '../../../servicios/user.service';
import { GlobalCostants } from '../../../shared/global-constants';
import { ClubService } from 'src/app/servicios/club.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  onAddUser = new EventEmitter();
  onEditUser = new EventEmitter();
  userForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Agregar";
  responseMessage: any;
  club: any = [];

  roles = ROLES;
  publico = false;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private clubService: ClubService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalCostants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalCostants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalCostants.contactNumberRegex)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      role: ['delegado', Validators.required],
      clubId: [null, Validators.required]
      
    });
    this.publico = !!this.dialogData?.publico || !localStorage.getItem('token');
    if (this.publico) this.action = 'Registrarse';
    if (this.dialogData?.action === 'Editar') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      const datos = { ...this.dialogData.data, password: null };
      if (datos.role === 'user') datos.role = 'delegado';
      this.userForm.patchValue(datos);
      // Al editar, la contraseña es opcional (vacía = se mantiene)
      this.userForm.controls.password.setValidators([Validators.minLength(6)]);
      this.userForm.controls.password.updateValueAndValidity();
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

  handleSubmit() {
    if (this.dialogAction === 'Edit') {
      this.edit();
    }
    else {
      this.add();
    }
  }
  add() {
    var formData = this.userForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      role:formData.role,
      clubId: formData.clubId,

    }
    this.userService.signup(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddUser.emit();
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
    var formData = this.userForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
      role:formData.role,
      clubId: formData.clubId
    }
    this.userService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditUser.emit();
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

