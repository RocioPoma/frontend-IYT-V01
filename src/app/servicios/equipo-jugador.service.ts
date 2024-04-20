import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipoJugadorService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA AGREGAR JUGADORES A UN EQUIPO
  add(data: any) {
    return this.httpClient.post(this.url +
      "/equipojugador/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR CLUB ------------------------------
  delete(id_equipo: any,id_contempla:any,ci: any) {
    return this.httpClient.delete(this.url +
      "/equipojugador/delete/" + id_equipo+'/'+id_contempla+'/'+ci, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA LISTAR JUGADORES DE UN EQUIPO ----------------------------------------------------
  get(id_club: any,id_contempla: any) {
    return this.httpClient.get(this.url + "/equipojugador/get/" + id_club+'/'+id_contempla);
  }

  //----------------------API PARA LISTAR JUGADORES DE UN EQUIPO (Habilitados en cancha) ----------------------------
  getJugadorEnCancha(id_club: any,id_contempla: any) {
    return this.httpClient.get(this.url + "/equipojugador/getJugadorEnCancha/" + id_club+'/'+id_contempla);
  }
  //----------------------API PARA LISTAR JUGADORES DE UN EQUIPO (Habilitados en cancha) ----------------------------
  getJugadorEnBanca(id_club: any,id_contempla: any) {
    return this.httpClient.get(this.url + "/equipojugador/getJugadorEnBanca/" + id_club+'/'+id_contempla);
  }

  //----------------------API PARA LISTAR JUGADORES DE UN EQUIPO (Habilitados en cancha) ----------------------------
  getTotalEnCancha(id_club: any,id_contempla: any) {
    return this.httpClient.get(this.url + "/equipojugador/getTotalEnCancha/" + id_club+'/'+id_contempla);
  }

   //----------------------API PARA MODIFICAR ESTADO EQUIPO-JUGADOR -------------------------------------------------
   updateEstado(data: any) {
    return this.httpClient.patch(this.url +
      "/equipojugador/updateEstado/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json") 
    });
  }
 
}
