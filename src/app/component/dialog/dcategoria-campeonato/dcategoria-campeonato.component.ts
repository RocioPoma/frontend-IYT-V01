import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/servicios/categoria.service';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { DisciplinaService } from 'src/app/servicios/disciplina.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-dcategoria-campeonato',
  templateUrl: './dcategoria-campeonato.component.html',
  styleUrls: ['./dcategoria-campeonato.component.scss']
})
export class DcategoriaCampeonatoComponent implements OnInit {
  onAdd = new EventEmitter();
  onEdit = new EventEmitter();
  dcategoriaForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Agregar";
  responseMessage: any;

  disciplina: any = [];
  categoria: any = [];
  requisito: any;

  genero = ['Femenino','Masculino','Mixto'];
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private disciplinaService: DisciplinaService,
    private categoriaService: CategoriaService,
    private dialogRef: MatDialogRef<DcategoriaCampeonatoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.dcategoriaForm = this.formBuilder.group({
      edad_min: [null, Validators.required],
      edad_max: [null, Validators.required],
      genero: [null, Validators.required],
      num_max_jugadores:[null, Validators.required],
      sistema_de_juego:[null, Validators.required],
      id_campeonato: [null],
      id_disciplina: [null, Validators.required],
      id_categoria: [null, Validators.required],
      requisito: [null, Validators.required],
      edad_obligatoria: [null]
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Actualizar";
      console.log('datos dialog '+ JSON.stringify(this.dialogData.data));
      this.dcategoriaForm.patchValue(this.dialogData.data);
    }
    this.getDisciplinas();
    this.getCategorias();
  }

  //------------------- OBTENEMOS LAS DISCIPLINAS
  getDisciplinas() {
    this.disciplinaService.getDisciplina().subscribe((response: any) => {
      this.disciplina = response;
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

  //------------------- OBTENEMOS LAS CATEGORIAS
  getCategorias() {
    this.categoriaService.getCataegoria().subscribe((response: any) => {
      this.categoria = response;
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
    var formData = this.dcategoriaForm.value;

    var data = {
      edad_min: formData.edad_min,
      edad_max: formData.edad_max,
      genero: formData.genero,
      num_max_jugadores: formData.num_max_jugadores,
      id_campeonato: this.dialogData.id_campeonato,
      id_disciplina: formData.id_disciplina,
      id_categoria: formData.id_categoria,
      sistema_de_juego: formData.sistema_de_juego,
      requisito: formData.requisito,
      edad_obligatoria: formData.edad_obligatoria
    }

    this.dcategoriacampeonatoService.add(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAdd.emit();
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
    var formData = this.dcategoriaForm.value;
    var data = {
      id: this.dialogData.data.id,
      edad_min: formData.edad_min,
      edad_max: formData.edad_max,
      genero: formData.genero,
      num_max_jugadores: formData.num_max_jugadores,
      id_campeonato: this.dialogData.id_campeonato,
      id_disciplina: formData.id_disciplina,
      id_categoria: formData.id_categoria,
      sistema_de_juego: formData.sistema_de_juego,
      requisito: formData.requisito,
      edad_obligatoria: formData.edad_obligatoria
    }
    this.dcategoriacampeonatoService.update(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEdit.emit();
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
   changeSelectRequisito(requisito:any){
    if (this.dialogAction === 'Edit') {
      this.requisito = this.dialogData.data.requisito;
    }
    else {
      this.requisito = requisito;
    }
    
  }
}


