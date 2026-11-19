import { Component, EventEmitter, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClubService } from 'src/app/servicios/club.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.scss']
})
export class ClubComponent implements OnInit {
  onAddClub = new EventEmitter();
  onEditClub = new EventEmitter();
  clubForm:any= FormGroup;
  dialogAction:any="Add";
  action:any="Registrar";
  responseMessage:any;
  logo: File | null = null;
  vistaLogo: string | null = null;
  guardando = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private clubService:ClubService,
  private dialogRef:MatDialogRef<ClubComponent>,
  private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.clubForm = this.formBuilder.group({
      nombre: [null, [Validators.required]],
      comunidad: [null, [Validators.required]]
    });
    if(this.dialogData.action ==='Edit') {
      this.dialogAction="Edit";
      this.action ="Actualizar";
      this.clubForm.patchValue(this.dialogData.data);
      if (this.dialogData.data?.logo) this.vistaLogo = environment.apiUrl + '/uploads/img/' + this.dialogData.data.logo;
    }
  }

  elegirLogo(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(archivo.type)) {
      this.snackbarService.openSnackBar('El logo debe ser una imagen JPG, PNG o WEBP', GlobalCostants.error);
      return;
    }
    if (archivo.size > 10 * 1024 * 1024) {
      this.snackbarService.openSnackBar('El logo supera los 10 MB', GlobalCostants.error);
      return;
    }
    this.logo = archivo;
    const lector = new FileReader();
    lector.onload = () => (this.vistaLogo = lector.result as string);
    lector.readAsDataURL(archivo);
  }

  quitarLogo() {
    this.logo = null;
    const actual = this.dialogData.data?.logo;
    this.vistaLogo = actual ? environment.apiUrl + '/uploads/img/' + actual : null;
  }

  handleSubmit(){
    if(this.dialogAction ==='Edit') {
      this.edit();
    }
    else{
      this.add();
    }
  }

  add(){
    var formData = this.clubForm.value;
    var data ={
      nombre: formData.nombre,
      comunidad: formData.comunidad,
    }
    this.guardando = true;
    this.clubService.add(data, this.logo).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddClub.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalCostants.error);
    })
  }

  edit(){
    var formData = this.clubForm.value;
    var data ={
      id:this.dialogData.data.id,
      nombre: formData.nombre,
      comunidad: formData.comunidad,
    }
    this.guardando = true;
    this.clubService.update(data, this.logo).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditClub.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalCostants.error);
    })
  }


}
