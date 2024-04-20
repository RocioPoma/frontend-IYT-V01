import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA OBTENER O LISTAR DATOS -------------------todavia no se utilizo
  getAll() {
    return this.httpClient.get(this.url + "/equipo/get_all/")
  }

  //----------------------API PARA LISTAR EQUIPOS DE UNA CATEGORIA ESPECIFICA -------- se utilizo
  get(id_contempla: any) {
    return this.httpClient.get(this.url + "/equipo/get/" + id_contempla);
  }

  //----------------------API PARA OBTENER SEGUN ID DE UN EQUIPO -------- se utilizo
  getById(id: any) {
    return this.httpClient.get(this.url + "/equipo/getById/" + id);
  }

  //----------------------API PARA AGREGAR --------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/equipo/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA MODIFICAR --------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/equipo/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR  ------------------------------
  delete(id_club: any,id_contempla:any) {
    return this.httpClient.delete(this.url +
      "/equipo/delete/" + id_club+'/'+id_contempla, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
