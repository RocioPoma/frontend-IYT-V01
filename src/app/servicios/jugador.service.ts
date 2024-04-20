import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Jugador } from '../model/jugador.model';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR JUGADORES ------------------------------
  getJugadors() {
    return this.httpClient.get(this.url + "/jugador/get/")
    //return this.httpClient.get<Jugador[]>(this.url + "/noticia/get/")
  }

  //----------------------API PARA AGREGAR JUGADOR ------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/jugador/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA AGREGAR JUGADOR incluye imagen ------------------
  add1(data: any, foto: File) {
    const fd = new FormData();
    fd.append('ci',data.ci);
    fd.append('nombre', data.nombre);
    fd.append('ap_paterno', data.ap_paterno);
    fd.append('ap_materno', data.ap_materno);
    fd.append('fecha_nacimiento', data.fecha_nacimiento);
    fd.append('sexo',data.sexo);
    fd.append('decendencia',data.decendencia);
    fd.append('clubId',data.clubId);
    fd.append('fecha_habilitacion',data.fecha_habilitacion);
    fd.append('foto', foto);
  
    return this.httpClient.post(this.url +
      "/jugador/add/",fd);
  }
/*
  add1(ci: string, nombre: string, ap_paterno: string, ap_materno: string, fecha_nacimiento: string, sexo: string,decendencia: string, clubId: string, fecha_habilitacion: any, foto: File) {
    const fd = new FormData();
    fd.append('ci',ci);
    fd.append('nombre', nombre);
    fd.append('ap_paterno', ap_paterno);
    fd.append('ap_materno', ap_materno);
    fd.append('fecha_nacimiento', fecha_nacimiento);
    fd.append('sexo',sexo);
    fd.append('decendencia',decendencia);
    fd.append('clubId',clubId);
    fd.append('fecha_habilitacion',fecha_habilitacion);
    fd.append('foto', foto);
    return this.httpClient.post(this.url +
      "/jugador/add/", fd);
  }
*/
  //----------------------API PARA MODIFICAR JUGADOR ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/jugador/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  //modificar con imagen
  update1(data: any, foto: File) {
    const fd = new FormData();
    fd.append('ci',data.ci);
    fd.append('ci_mod',data.ci_mod);
    fd.append('nombre', data.nombre);
    fd.append('ap_paterno', data.ap_paterno);
    fd.append('ap_materno', data.ap_materno);
    fd.append('fecha_nacimiento', data.fecha_nacimiento);
    fd.append('sexo',data.sexo);
    fd.append('decendencia',data.decendencia);
    fd.append('clubId',data.clubId);
    fd.append('fecha_habilitacion',data.fecha_habilitacion);
    fd.append('nombreimg',data.nombreimg);
    fd.append('foto', foto);
    return this.httpClient.patch(this.url +
      "/jugador/update/", fd);
  }

  //----------------------API PARA SUBIR DOCUMENTACIÓN ------------------------------
  subirDocumetos(data: any, documento: File) {
    const fd = new FormData();
    fd.append('ci',data.ci);
    fd.append('documento', documento);
    return this.httpClient.patch(this.url +
      "/jugador/subir_documento/", fd);
  }

  //----------------------API PARA ELIMINAR JUGADOR ------------------------------
  delete(ci: any) {
    return this.httpClient.delete(this.url +
      "/jugador/delete/" + ci, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/jugador/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  getJugadorByIdClub(id: any) {
    return this.httpClient.get(this.url + "/jugador/getByClub/" + id);
  }

  getById(ci: any) {
    return this.httpClient.get(this.url + "/jugador/getById/" + ci);
  }

 //------------------------ OBTENER JUGADOR SEGUN SEXO, CLUB, Y RAGO DE EDADES --------------------------------
 getJugadoresByEdad(id_club: any,sexo: any,edad_min:any,edad_max: any) {
    return this.httpClient.get(this.url + "/jugador/getJugadoresByEdad/" + id_club+'/'+sexo+'/'+edad_min+'/'+edad_max);
  }
} 
