import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SerieService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //---------------------- API PARA LISTAR SERIE ---------------------------
  getSerie() {
    return this.httpClient.get(this.url + "/serie/get/")
  }

  //----------------------API PARA AGREGAR ---------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/serie/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA MODIFICAR  ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/serie/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/serie/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  
 //----------------------API PARA ELIMINAR -------------------------------------
  delete(id_serie: any) {
    return this.httpClient.delete(this.url +
      "/serie/delete/" + id_serie, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
