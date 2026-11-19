import { Component, EventEmitter, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { DateAdapter } from '@angular/material/core';
import { GlobalCostants } from 'src/app/shared/global-constants';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ClubService } from 'src/app/servicios/club.service';
import { COMUNIDADES, PATRON_ROMANO, normalizarNombre } from 'src/app/shared/comunidades';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-campeonato',
  templateUrl: './campeonato.component.html',
  styleUrls: ['./campeonato.component.scss']
})
export class CampeonatoComponent implements OnInit {
  onAddCampeonato = new EventEmitter();
  onEditCampeonato = new EventEmitter();
  campeonatoForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Crear";
  responseMessage: any;
  file!: File;
  photoSelected!: ArrayBuffer | string | null;

  //----url del servidor backend 
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL2 = this.url + '/uploads/img/';

  imgURL = '../../../../assets/img/img.jpg';
  comunidades: string[] = [...COMUNIDADES];
  clubs: any[] = [];
  image = '';


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private campeonatoService: CampeonatoService,
    private _sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<CampeonatoComponent>,
    private snackbarService: SnackbarService,
    private clubService: ClubService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit(): void {
    this.campeonatoForm = this.formBuilder.group({
      nombre_campeonato: [null, Validators.required],
      fecha_inicio: [null, Validators.required],
      fecha_fin: [null, Validators.required],
      convocatoria: [null],
      gestion: [null, [Validators.required,Validators.minLength(4)]],
      numero_romano: [null, [Validators.required, Validators.pattern(PATRON_ROMANO)]],
      comunidad_anfitriona: [null, Validators.required],
      id_club_anfitrion: [null],
    });
    this.clubService.getClubs().subscribe((r: any) => {
      this.clubs = (r || []).slice().sort((a: any, b: any) => String(a.nombre).localeCompare(String(b.nombre), 'es'));
      // comunidades de los clubs que no estén en la lista oficial
      for (const c of this.clubs) {
        if (c.comunidad && !this.comunidades.some((x) => normalizarNombre(x) === normalizarNombre(c.comunidad))) this.comunidades.push(c.comunidad);
      }
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      const d = this.dialogData.data || {};
      if (d.comunidad_anfitriona && !this.comunidades.includes(d.comunidad_anfitriona)) this.comunidades.push(d.comunidad_anfitriona);
      this.campeonatoForm.patchValue(this.dialogData.data);
    }
  }

  /** El número del campeonato siempre en mayúsculas */
  mayusculas() {
    const c = this.campeonatoForm.controls.numero_romano;
    const v = String(c.value || '').toUpperCase().replace(/\s+/g, '');
    if (v !== c.value) c.setValue(v);
  }

  get clubsComunidad(): any[] {
    const com = normalizarNombre(this.campeonatoForm.value.comunidad_anfitriona);
    return com ? this.clubs.filter((c) => normalizarNombre(c.comunidad).includes(com) || com.includes(normalizarNombre(c.comunidad) || '#')) : [];
  }

  get otrosClubs(): any[] {
    const ids = new Set(this.clubsComunidad.map((c) => c.id));
    return this.clubs.filter((c) => !ids.has(c.id));
  }

  /** Al elegir la comunidad, se propone su club como anfitrión */
  elegirComunidad(comunidad: string) {
    const club = this.clubsComunidad[0];
    this.campeonatoForm.controls.id_club_anfitrion.setValue(club ? club.id : null);
    this.campeonatoForm.markAsDirty();
  }

  //--------------------------- SELECCIONAMOS ARCHIVO PARA MOSTRARLO EN EL MODAL ------------------
  selectFile(event: any): any {
    this._sanitizer.bypassSecurityTrustStyle(event.target.files);
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
    var formData = this.campeonatoForm.value;
    console.log(formData);
    var data = { 
      nombre_campeonato: formData.nombre_campeonato,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      convocatoria: formData.convocatoria,
      gestion: formData.gestion,
      numero_romano: formData.numero_romano,
      comunidad_anfitriona: formData.comunidad_anfitriona,
      id_club_anfitrion: formData.id_club_anfitrion,
    }
    this.campeonatoService.add1(data,this.file).subscribe((response: any) => {
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
    var formData = this.campeonatoForm.value;
    var data = {
      id: this.dialogData.data.id,
      nombre_campeonato: formData.nombre_campeonato,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      convocatoria: formData.convocatoria,
      gestion: formData.gestion,
      nombre_conv:this.dialogData.data.convocatoria,
      numero_romano: formData.numero_romano,
      comunidad_anfitriona: formData.comunidad_anfitriona,
      id_club_anfitrion: formData.id_club_anfitrion,
    }
    this.campeonatoService.update1(data,this.file).subscribe((response: any) => {
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
