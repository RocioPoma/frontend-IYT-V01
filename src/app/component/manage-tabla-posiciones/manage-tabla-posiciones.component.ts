import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  equipo: string;
  puntos: number;
  juegos: number;
  ganados: number;
  empates: number;
  perdido: number;
  golesfavor: number;
  golescontra: number;
  diferenciagoles: number;
  aprovechamiento: number;
  extra: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { equipo: 'Aurora', puntos: 3, juegos: 1, ganados: 1, empates: 0, perdido: 1, golesfavor: 12, golescontra: 10, diferenciagoles: 2, aprovechamiento: 100, extra: 0 },
  { equipo: 'Ingavi', puntos: 1, juegos: 1, ganados: 0, empates: 1, perdido: 1, golesfavor: 0, golescontra: 0, diferenciagoles: 0, aprovechamiento: 50, extra: 0 },
  { equipo: 'Real Maracana', puntos: 1, juegos: 1, ganados: 0, empates: 1, perdido: 1, golesfavor: 0, golescontra: 0, diferenciagoles: 0, aprovechamiento: 50, extra: 0 },
  { equipo: 'Bolivar', puntos: 0, juegos: 1, ganados: 0, empates: 0, perdido: 1, golesfavor: 10, golescontra: 12, diferenciagoles: 2, aprovechamiento: 0, extra: 0 },
];

@Component({
  selector: 'app-manage-tabla-posiciones',
  templateUrl: './manage-tabla-posiciones.component.html',
  styleUrls: ['./manage-tabla-posiciones.component.scss']
})
export class ManageTablaPosicionesComponent implements OnInit {

  displayedColumnsTP: string[] = ['numero', 'equipos', 'pts', 'j', 'g', 'e', 'p', 'gf', 'gc', 'dif', '%', 'pe'];
  dataSourceTP = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
