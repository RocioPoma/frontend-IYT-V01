import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuspiciadorService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA OBTENER O LISTAR DATOS -------------------
  getAllAuspiciador() {
    return this.httpClient.get(this.url + "/auspiciador/get_all/")
  }

  //----------------------API PARA OBTENER O LISTAR DATOS -------------------
  getAuspiciador() {
    return this.httpClient.get(this.url + "/auspiciador/get/")
  }
  //----------------------API PARA AGREGAR --------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/auspiciador/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA MODIFICAR --------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/auspiciador/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR  ------------------------------
  delete(id_ausp: any) {
    return this.httpClient.delete(this.url +
      "/auspiciador/delete/" + id_ausp, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/auspiciador/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
