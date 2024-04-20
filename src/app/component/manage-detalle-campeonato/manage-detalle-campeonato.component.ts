import { Component, Inject, OnInit } from '@angular/core';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { environment } from 'src/environments/environment';
import { Campeonato } from 'src/app/model/campeonato.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({

  selector: 'app-manage-detalle-campeonato',
  templateUrl: './manage-detalle-campeonato.component.html',
  styleUrls: ['./manage-detalle-campeonato.component.scss']
})

export class ManageDetalleCampeonatoComponent implements OnInit {
  displayedColumns: string[] = ['nombre_campeonato', 'fecha_inicio', 'fecha_fin', 'convocatoria'];

  //----url del servidor backend
  url = environment.apiUrl;

  //----creamos la url para las imagenes
  imgURL = this.url + '/uploads/img/';

  arraycamp: any = [];
  //arraycamp: any;

  dataSource: any;
  responseMessage: any;
  idCamp: any;

  menu_campeonato = ['Categorias', 'Noticias', 'Auspiciadores', 'Reportes'];

  id: string | null = '';

  constructor(private campeonatoService: CampeonatoService,
    private router: Router,
    private route: ActivatedRoute ) { }

  public idres: any;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.datosCampeonato(this.id);
  }

  datosCampeonato(id: any) {
    this.campeonatoService.getByIdc(id).subscribe(res => {
        this.arraycamp = res;
        //console.log("datos RES: " + JSON.stringify(this.arraycamp));
      },
      err => console.log(err)
    )
  }
  

  handleAction(values: any) {
    console.log("valor"+ values);
    this.router.navigate(['/integracion/noticia',this.id]);
    /*
    this.campeonatoService.campeonatoEmiter.emit({ data: 1});
    this.router.navigate(['/integracion/dcampeonato',values.id]);*/
  }



  /*
  tableData2() {
    this.campeonatoService.campeonatoEmiter.subscribe(res => {
      //console.log('Datos Campeonato ' + res.datosCampeonato);
      this.arraycamp = res.datosCampeonato;
      this.dataSource = new MatTableDataSource(res);
      //this.bandera=data.data;
      console.log("IdRes: " + JSON.stringify(this.arraycamp));
    },
      err => console.log(err)
    )
  }*/

/////////////////////////////////////////////

  /*
  //-----------CON OBSERVABLE-----------    
    arrayCampeonato(){
      this.campeonatoService.getCampeonatoObservable$().subscribe(data => {
        console.log("Array Camp 1"+JSON.stringify(this.arraycamp));
        this.arraycamp=data;
        //this.arraycamp=this.arraycamp[0];
        console.log("Array Camp"+JSON.stringify(this.arraycamp));
        //console.log("Array Camp");
      });
    }
  */
  /*
  tableData2(){
    this.campeonatoService.disparador.subscribe(res => {
      //console.log('Datos Campeonato ' + res.datosCampeonato);
      this.idres = res.idCampeonato;
      //this.bandera=data.data;
      console.log("IdRes: " + this.idres);
    },
      err => console.log(err)
    )
    console.log("IdRes Afuera: " + this.idres);
  }*/

  /* tableData1(): Observable<number> {
     let idc:number;
     var subject = new Subject<number>();
     this.campeonatoService.disparador.subscribe(dato => {
       
       console.log("entro...............")
       // this.arraycamp=[JSON.stringify(datos.datosCampeonato)];
       //this.aux=JSON.stringify(datos.datosCampeonato);
       //console.log('Datos Campeonato ' + Object.values( this.aux));
       //this.noticias = [res.datosCampeonato]
       //this.bandera=data.data;
       // this.campeonatos=res.datosCampeonato;
       //this.aux=datos.datosCampeonato;
       //      console.log("id: "+JSON.stringify(this.aux));
       idc = dato.idCampeonato;
       //this.idCamp = dato.idCampeonato;
      // console.log("id: " + this.idCamp);
       console.log("idCamp: " + idc);
       subject.next(idc);
       //this.tableData(this.idCamp);
       // return this.idCamp;
       //return this.idCamp;
     },
       err => console.log(err)
     );
     //console.log("id afuera: " + this.idCamp);
     return subject.asObservable();
   } */

  /*
  tableData(id: any) {
    console.log("idTabla: " + id);
    console.log("idCamp: " +this.idCamp);
    this.campeonatoService.getById1(id).subscribe(
      res => {
        this.arraycamp = [res];
        console.log("datos RES: " + this.arraycamp);
      },
      err => console.log(err)
    )
  }*/

}
