import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PasejugadorService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //---------------------- API PRAR LISTAR REGLAMENTO ----------------------------------------------
  getPase() {
    return this.httpClient.get(this.url + "/pase/get/")
  }

  //----------------------API PARA AGREGAR REGLAMENTO incluye file ------------------
  add(data: any, documento: File) {
    const fd = new FormData();
    fd.append('id_club_solicitante', data.id_club_solicitante);
    fd.append('id_club_solicitado', data.id_club_solicitado);
    fd.append('ci', data.ci);
    fd.append('fecha', data.fecha);
    fd.append('documento', documento);
    return this.httpClient.post(this.url +
      "/pase/add/", fd);
  }

  //----------------------API PARA MODIFICAR REGLAMENTO incluye file ------------------------------
  update(data: any, documento: File) {
    const fd = new FormData();
    fd.append('id_pase', data.id_pase);
    fd.append('id_club_solicitante', data.id_club_solicitante);
    fd.append('id_club_solicitado', data.id_club_solicitado);
    fd.append('ci', data.ci);
    fd.append('fecha', data.fecha);
    fd.append('documento', documento);
    return this.httpClient.patch(this.url +
      "/pase/update/", fd);
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/pase/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  
 //----------------------API PARA ELIMINAR REGLAMENTO incluye file ------------------------------
  delete(id_pase: any) {
    return this.httpClient.delete(this.url +
      "/pase/delete/" + id_pase, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
