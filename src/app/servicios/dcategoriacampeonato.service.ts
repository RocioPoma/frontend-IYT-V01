import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DcategoriacampeonatoService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA OBTENER O LISTAR DATOS -------------------todavia no se utilizo
  getAll() {
    return this.httpClient.get(this.url + "/dcategoriacampeonato/get_all/")
  }

  //----------------------API PARA LISTAR CATEGORIAS DE UN CAMPEONATO ESPECIFICO -------- se utilizo
  get(id_campeonato: any) {
    return this.httpClient.get(this.url + "/dcategoriacampeonato/get/" + id_campeonato);
  }

  //----------------------API PARA OBTENER SEGUN ID DE CONTEMPLA UNA CATEGORIA ESPECIFICA -------- se utilizo
  getById(id: any) {
    return this.httpClient.get(this.url + "/dcategoriacampeonato/getById/" + id);
  }

  //----------------------API PARA AGREGAR --------------------------------
  add(data: any) {
    return this.httpClient.post(this.url +
      "/dcategoriacampeonato/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA MODIFICAR --------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/dcategoriacampeonato/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR  ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/dcategoriacampeonato/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/dcategoriacampeonato/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
