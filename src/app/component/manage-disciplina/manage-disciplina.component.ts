import { Component, OnInit } from '@angular/core';
import { DisciplinaService } from 'src/app/servicios/disciplina.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-disciplina',
  templateUrl: './manage-disciplina.component.html',
  styleUrls: ['./manage-disciplina.component.scss']
})
export class ManageDisciplinaComponent implements OnInit {

  datosDisciplina: any = [];
  responseMessage: any;
  imgURL='../../../assets/img/deportes/';
  extension='.jpg';

  //imagen=['futbol', 'futsal','futbol_8','baloncesto','']
  
  constructor( private disciplinaService:DisciplinaService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.datosDisciplinaTabla();
  }

  datosDisciplinaTabla(){
    this.disciplinaService.getAllDisciplina().subscribe(res => {
      this.datosDisciplina = res;
    },
      err => console.log(err))
  }

  onChange(status: any, id: any) {
    var data = {
      status: status.toString(),
      id: id
    }
    this.disciplinaService.updateStatus(data).subscribe((response: any) => {
      this.datosDisciplinaTabla();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "success");
    }, (error: any) => {
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
