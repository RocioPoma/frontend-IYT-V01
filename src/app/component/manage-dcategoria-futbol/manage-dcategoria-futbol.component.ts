import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';

@Component({
  selector: 'app-manage-dcategoria-futbol',
  templateUrl: './manage-dcategoria-futbol.component.html',
  styleUrls: ['./manage-dcategoria-futbol.component.scss']
})
export class ManageDcategoriaFutbolComponent implements OnInit {
  arraycamp: any = [];
  //arraycamp: any;

  dataSource: any;
  responseMessage: any;
  idCamp: any;
  id_contempla: string | null = ''; //contempla categoria disciplina y campeonato

  menu_campeonato = ['Equipos', 'Fixture', 'TablaPosiciones', 'Rankings Jugadores', 'Series'];


  imgURL = '../../../assets/img/deportes/';
  extension = '.jpg';

  constructor(
    private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private campeonatoService: CampeonatoService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id_contempla = this.route.snapshot.paramMap.get('id_contempla');

    this.dataTable(this.id_contempla);
    //this.datosCampeonato(this.id);
  }

  //---------------------LISTA DISCIPLINA, CATEGORIA .. DE UN CAMPEONATO ESPECIFICO  -------------
  dataTable(id: any) {
    this.dcategoriacampeonatoService.getById(id).subscribe(res => {
      this.dataSource = res;
      console.log("datos RES: " + JSON.stringify(this.dataSource));
    },
      err => console.log(err)
    )
  }

  //---------------------LISTA DE CAMPEONATO ---------------------------------------
  datosCampeonato(id: any) {
    this.campeonatoService.getByIdc(id).subscribe(res => {
      this.arraycamp = res;
    },
      err => console.log(err)
    )
  }


  handleAction(values: any) {
    console.log("valor" + values);
    this.router.navigate(['/integracion/noticia', this.id_contempla]);
    /*
    this.campeonatoService.campeonatoEmiter.emit({ data: 1});
    this.router.navigate(['/integracion/dcampeonato',values.id]);*/
  }

  //---------------------MOSTRAR Y OCULTAR ------------------
  handleDetalle() {
    document.getElementById('contenido-cat')!.style.display = 'block';
    document.getElementById('contenido-equipo')!.style.display = 'none';
    document.getElementById('contenido-partido')!.style.display = 'none'; 
    document.getElementById('contenido-tablaposiciones')!.style.display = 'none'; 
    document.getElementById('contenido-rankingJugadores')!.style.display = 'none'; 
  }
  handleEquipos() {
    document.getElementById('contenido-cat')!.style.display = 'none';
    document.getElementById('contenido-equipo')!.style.display = 'block';
    document.getElementById('contenido-partido')!.style.display = 'none'; 
    document.getElementById('contenido-tablaposiciones')!.style.display = 'none'; 
    document.getElementById('contenido-rankingJugadores')!.style.display = 'none'; 
  }
  handleFixture() {
    document.getElementById('contenido-cat')!.style.display = 'none';
    document.getElementById('contenido-equipo')!.style.display = 'none';
    document.getElementById('contenido-partido')!.style.display = 'block';
    document.getElementById('contenido-tablaposiciones')!.style.display = 'none'; 
    document.getElementById('contenido-rankingJugadores')!.style.display = 'none'; 
  }
  handleTP(){
    document.getElementById('contenido-cat')!.style.display = 'none';
    document.getElementById('contenido-equipo')!.style.display = 'none';
    document.getElementById('contenido-partido')!.style.display = 'none';
    document.getElementById('contenido-tablaposiciones')!.style.display = 'block'; 
    document.getElementById('contenido-rankingJugadores')!.style.display = 'none'; 
  }
  handleRankings() {
    document.getElementById('contenido-cat')!.style.display = 'none';
    document.getElementById('contenido-equipo')!.style.display = 'none';
    document.getElementById('contenido-partido')!.style.display = 'none';
    document.getElementById('contenido-tablaposiciones')!.style.display = 'none'; 
    document.getElementById('contenido-rankingJugadores')!.style.display = 'block'; 
  }

}
