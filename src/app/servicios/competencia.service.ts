// Consultas de la competencia: fixture, tabla de posiciones, ranking, medallero y programación de partidos.
// Las consultas son públicas (RF01): funcionan con o sin sesión.
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface FilaPosicion {
  posicion: number;
  id_club: number;
  equipo: string;
  logo: string | null;
  pts: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  rendimiento: number;
}

export interface FilaRanking {
  posicion: number;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
  foto: string | null;
  club: string;
  hecho: string;
  total: number;
}

export interface Partido {
  id_partido: number;
  id_equipo1: number;
  id_equipo2: number;
  equipo1: string;
  equipo2: string;
  logo1: string | null;
  logo2: string | null;
  ronda: number | null;
  estado: string;
  fecha: string | null;
  fecha_f: string | null;
  hora_f: string | null;
  id_cancha: number | null;
  nombre_cancha: string | null;
  id_arbitro: string | null;
  nombre_arbitro: string | null;
  total_equipo1: number;
  total_equipo2: number;
}

export interface Medallero {
  resumen: { id_club: number; club: string; logo: string | null; oro: number; plata: number; bronce: number; total: number }[];
  detalle: { id_contempla: number; puesto: number; id_club: number; club: string; disciplina: string; categoria: string; genero: string }[];
}

@Injectable({ providedIn: 'root' })
export class CompetenciaService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  partidos(idContempla: number | string, idSerie: number | string = 0): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${this.url}/partido/get/${idContempla}/${idSerie || 0}`);
  }

  proximos(limite = 20): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${this.url}/partido/proximos`, { params: { limite } });
  }

  tabla(idContempla: number | string, opciones: { idSerie?: number | string; enVivo?: boolean } = {}): Observable<FilaPosicion[]> {
    let params = new HttpParams();
    if (opciones.idSerie !== undefined && opciones.idSerie !== null && opciones.idSerie !== '') params = params.set('id_serie', opciones.idSerie);
    if (opciones.enVivo) params = params.set('en_vivo', '1');
    return this.http.get<FilaPosicion[]>(`${this.url}/partido/tabla/${idContempla}`, { params });
  }

  ranking(idContempla: number | string, idHecho = 1): Observable<FilaRanking[]> {
    return this.http.get<FilaRanking[]>(`${this.url}/partido/ranking/${idContempla}`, { params: { id_hecho: idHecho } });
  }

  tiposHecho(): Observable<{ id_hecho: number; nombre: string }[]> {
    return this.http.get<{ id_hecho: number; nombre: string }[]>(`${this.url}/hechospartido/tipos`);
  }

  programar(datos: { id_partido: number; fecha: string | null; hora: string | null; id_cancha: number | null; id_arbitro: string | null }) {
    return this.http.patch<{ message: string }>(`${this.url}/partido/programar`, datos);
  }

  medalleroCampeonato(idCampeonato: number | string): Observable<Medallero> {
    return this.http.get<Medallero>(`${this.url}/medallero/campeonato/${idCampeonato}`);
  }

  medalleroCategoria(idContempla: number | string) {
    return this.http.get<Medallero['detalle']>(`${this.url}/medallero/categoria/${idContempla}`);
  }

  registrarMedallero(datos: { id_contempla: number | string; primero: number; segundo?: number | null; tercero?: number | null }) {
    return this.http.post<{ message: string }>(`${this.url}/medallero/registrar`, datos);
  }

  eliminarMedallero(idContempla: number | string) {
    return this.http.delete<{ message: string }>(`${this.url}/medallero/delete/${idContempla}`);
  }

  equipos(idContempla: number | string) {
    return this.http.get<any[]>(`${this.url}/equipo/get/${idContempla}`);
  }

  estadoEquipo(datos: { id_club: number; id_contempla: number | string; estado: 'aprobado' | 'pendiente' | 'rechazado' }) {
    return this.http.patch<{ message: string }>(`${this.url}/equipo/updateStatus`, datos);
  }
}
