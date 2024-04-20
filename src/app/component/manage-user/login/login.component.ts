import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../../../servicios/snackbar.service';
import { UserService } from '../../../servicios/user.service';
import { GlobalCostants } from '../../../shared/global-constants';


@Component({
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
    private snackbarService: SnackbarService) { }


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

      console.log(response.data.nombre);
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
        console.log('salio error 1');
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
        console.log('salio error 2');
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
