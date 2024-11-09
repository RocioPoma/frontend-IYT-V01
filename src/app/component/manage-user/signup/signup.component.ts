import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
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

  role = ['user', 'admin'];

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
      password: [null, [Validators.required]],
      role: [null, Validators.required],
      clubId: [null, Validators.required]
      
    });
    if (this.dialogData.action === 'Editar') {
      //console.log('Password '+this.dialogData.data.password);
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      this.userForm.patchValue(this.dialogData.data);
      console.log(this.dialogData.data);
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

