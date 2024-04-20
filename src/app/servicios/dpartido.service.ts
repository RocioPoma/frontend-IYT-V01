import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DpartidoService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA OBTENER O LISTAR DATOS -------------------todavia no se utilizo
  getAll() {
    return this.httpClient.get(this.url + "/equipo/get_all/")
  }

  //----------------------API PARA LISTAR PARTIDOS DE UNA CATEGORIA ESPECIFICA -------- se utilizo getPartido
  get(id_contempla: any,id_serie: any) {
    return this.httpClient.get(this.url + "/partido/get/" + id_contempla+'/'+id_serie);
  }

  //----------------------API PARA LISTAR DATOS DE UN PARTIDO ESPECIFICO -------- se utilizo 
  getPartido(id_partido: any) {
    return this.httpClient.get(this.url + "/partido/getPartido/" + id_partido);
  }

  //----------------------API PARA GENERAR FIXTURE Y AGREGAR--------------------------------
  addFixture(data: any) {
    return this.httpClient.post(this.url +
      "/partido/add_fixture/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELEIMINAR FIXTURE ---------------------------------------
  deleteFixture(id_contempla: any) {
    return this.httpClient.delete(this.url +
      "/partido/delete/" + id_contempla, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ACTUALIZAR ESTADO PARTIDO ------------------------------- 
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/partido/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

   //----------------------API PARA ACTUALIZAR RESULTADO PARTIDO ------------------------------- 
   updateResultadoPartidos(data: any) {
    return this.httpClient.patch(this.url +
      "/partido/updateResultadoPartido/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }



  //---------------------------------------------------------------------------------------------------------------------
  //----------------------API PARA MODIFICAR --------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/equipo/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR  ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/equipo/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
