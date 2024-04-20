import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  nombre: string;
  ap: string;
  am: string;
  club: string;
  goles: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { nombre: 'Juan', ap:'Peres', am:'Peres',club:'Blivar',goles:10  },
  { nombre: 'Luis', ap:'Coro', am:'Coro',club:'Aurora',goles:6  },
  { nombre: 'Wilmer', ap:'Vaca', am:'Perez',club:'Aurora',goles:3 },
  { nombre: 'Manuel', ap:'Avendano ', am:'Lopez',club:'Aurora',goles:2 },
  { nombre: 'Mauro', ap:'Villa', am:'Nueva',club:'Aurora',goles:1 },
  
];


@Component({
  selector: 'app-manage-ranking-jugadores',
  templateUrl: './manage-ranking-jugadores.component.html',
  styleUrls: ['./manage-ranking-jugadores.component.scss']
})
export class ManageRankingJugadoresComponent implements OnInit {

  displayedColumnsTP: string[] = ['numero', 'nombre', 'ap', 'am', 'club', 'goles'];
  dataSourceTP = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
