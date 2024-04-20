import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArbitroService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //---------------------- API PARA LISTAR ARBITRO ----------------------
  getArbitro() {
    return this.httpClient.get(this.url + "/arbitro/get/")
  }

  //----------------------API PARA AGREGAR ---------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/arbitro/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA MODIFICAR  ------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/arbitro/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/arbitro/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  
 //----------------------API PARA ELIMINAR -------------------------------------
  delete(ci: any) {
    return this.httpClient.delete(this.url +
      "/arbitro/delete/" + ci, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
