import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/component/dialog/confirmation/confirmation.component';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  role: any;
  constructor(private router: Router,
    private dialog: MatDialog) {

  }
  

  logout(){ 
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data = {
      message: 'cerrar sesión'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user) => {
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);
    })
  }

  changePassword(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.width="550px";
    this.dialog.open(ChangePasswordComponent, dialogConfig);
  }

}
