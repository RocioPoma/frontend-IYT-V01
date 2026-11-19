import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { SignupComponent } from '../signup/signup.component';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../servicios/snackbar.service';
import { UserService } from '../../../servicios/user.service';
import { GlobalCostants } from '../../../shared/global-constants';


@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup;
  responseMessage: any;
  xusuario: any;

  @Input() dataEntrante: any;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog) { }

  olvide() {
    this.dialogRef.close();
    this.dialog.open(ForgotPasswordComponent, { width: '450px' });
  }

  registrarse() {
    this.dialogRef.close();
    this.dialog.open(SignupComponent, { width: '550px', data: { action: 'Registrarse', publico: true } });
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalCostants.emailRegex)]],
      password: [null, Validators.required]
    })
  }

  handleSubmit() {
    //this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password
    }
    this.userService.login(data).subscribe((response: any) => {
      //this.ngxService.stop();
      this.dialogRef.close();
      localStorage.setItem('token',response.token);

      this.xusuario=response.data.nombre;
    //  this.ejecutar( this.router, this.xusuario);
     // this.userService.disparadorDeUser.emit(this.xusuario)
      this.router.navigate(['/integracion/dashboard']);
      
      //this.router.navigate([{ outlets: { pie: ['pie', this.xusuario] } }]);
     // this.ejecutar( this.router, this.xusuario);

      
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    })
  }




  ejecutar( cro: Router, xnombre: string) {
    cro.navigate([{ outlets: { pie: ['integracion/pie/', xnombre] } }]);
    
  }


/*
  ejecutar(cro: Router, xnombre: string) {

    let mipromesa = new Promise(function (resolve: any, reject: any) {
      resolve();
    });
    mipromesa
    .then(function () {
      cro.navigate([{ outlets: { pie: ['pie', xnombre] } }]);
    })
    .catch(err=>console.log(err));
  }
*/
}
