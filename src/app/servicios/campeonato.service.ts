import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Campeonato } from '../model/campeonato.model';

@Injectable({
  providedIn: 'root'
})
export class CampeonatoService {

  url = environment.apiUrl;

  //----- Para obserbable-------------------------------------------
  private campeonato: Campeonato[];
  private campeonato$: Subject<Campeonato[]>;
  //----------------------------------------------------------------

  //----------------------Emitimos datos campeonato para pasar  a otro componente--------------------------------
  @Output() campeonatoEmiter: EventEmitter<any> = new EventEmitter();
  @Output() personaEmitter: EventEmitter<Campeonato> = new EventEmitter();

  constructor(private httpClient: HttpClient,) {
    this.campeonato = [];
    this.campeonato$ = new Subject();
  }


  //----------------------LISTAR CAMPEONATO ----------------------------------------------
  getCampeonato() {
    return this.httpClient.get(this.url + "/campeonato/get/")
  }

  //----------------------API PARA AGREGAR CAMPEONATO incluye file ------------------
  add1(data: any, convocatoria: File) {
    const fd = new FormData();
    fd.append('nombre_campeonato', data.nombre_campeonato);
    fd.append('fecha_inicio', data.fecha_inicio);
    fd.append('fecha_fin', data.fecha_fin);
    fd.append('convocatoria', convocatoria);
    fd.append('gestion', data.gestion);
    this.anfitrion(fd, data);
    return this.httpClient.post(this.url +
      "/campeonato/add/", fd);
  }
  //-----------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/campeonato/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA MODIFICAR CAMPEONATO ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/campeonato/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //modificar con file
  update1(data: any, convocatoria: File) {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('nombre_campeonato', data.nombre_campeonato);
    fd.append('fecha_inicio', data.fecha_inicio);
    fd.append('fecha_fin', data.fecha_fin);
    fd.append('gestion', data.gestion);
    fd.append('nombre_conv', data.nombre_conv);
    fd.append('convocatoria', convocatoria);
    this.anfitrion(fd, data);
    return this.httpClient.patch(this.url +
      "/campeonato/update/", fd);
  }

  /** Número en romanos, comunidad y club anfitrión (se usan en los carnets) */
  private anfitrion(fd: FormData, data: any) {
    fd.append('numero_romano', data.numero_romano || '');
    fd.append('comunidad_anfitriona', data.comunidad_anfitriona || '');
    fd.append('id_club_anfitrion', data.id_club_anfitrion ?? '');
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/campeonato/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR CAMPEONATO incluye file ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/campeonato/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }


  //----------------------API PARA LISTAR SEGUN EL ID ------------------------
  getByIdc(id: any) {
    return this.httpClient.get(this.url + "/campeonato/getByIdc/" + id);
  }

  getById1(id: any) {
    return this.httpClient.get<Campeonato[]>(this.url + "/campeonato/getById/" + id);
  }


  //----------------------API PARA COMUNICAR COMPONENTES Observable ------------------------------
  //--No lo usamos todavia
  obtenerCampeonato(vCampeonato: Campeonato) {
    this.campeonato.push(vCampeonato);
    this.campeonato$.next(this.campeonato);
  }

  getCampeonatoObservable$(): Observable<Campeonato[]> {
    return this.campeonato$.asObservable();
  }
  //------------------------------------------------------------------------------

}

