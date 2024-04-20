import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HechospartidoService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA AGREGAR HECHO PARTIDO ----------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/hechospartido/add_hecho/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------LISTAR HECHO PARTIDO (de un jugador, club, categoria especifica) ------------------------------
  getHechosPartidoJugador(id_club: any, id_contempla: any, id_hecho: any,id_partido: any) {
    return this.httpClient.get(this.url + "/hechospartido/getHechosPartido/" + id_club + '/' + id_contempla +'/' + id_hecho+'/'+id_partido);
  }

  //-------------------------------- LISTAR TOTAL GOLES PARTIDO --------------------------------------------------------
  getTotalGolesPartido(id_club: any, id_contempla: any,id_partido: any) {
    return this.httpClient.get(this.url + "/hechospartido/getTotalGolesPartido/" + id_club + '/' + id_contempla +'/' +id_partido);
  }



  ///------------------------------------------------------------------------------------------------------------------


 
  //----------------------API PARA MODIFICAR ESTADO EQUIPO-JUGADOR --------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/hechospartido/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }



  //----------------------API PARA ELIMINAR CLUB ------------------------------
  delete(id_equipo: any, id_contempla: any, ci: any) {
    return this.httpClient.delete(this.url +
      "/hechospartido/delete/" + id_equipo + '/' + id_contempla + '/' + ci, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
