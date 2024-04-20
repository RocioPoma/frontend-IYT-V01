import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReglamentoService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //---------------------- API PRAR LISTAR REGLAMENTO ----------------------------------------------
  getReglamento() {
    return this.httpClient.get(this.url + "/reglamento/get/")
  }

  //----------------------API PARA AGREGAR REGLAMENTO incluye file ------------------
  add(data: any, documento: File) {
    const fd = new FormData();
    fd.append('nombre', data.nombre);
    fd.append('documento', documento);
    return this.httpClient.post(this.url +
      "/reglamento/add/", fd);
  }

  //----------------------API PARA MODIFICAR REGLAMENTO incluye file ------------------------------
  update(data: any, documento: File) {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('nombre', data.nombre);
    fd.append('nombredoc', data.nombredoc);
    fd.append('documento', documento);
    return this.httpClient.patch(this.url +
      "/reglamento/update/", fd);
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/reglamento/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  
 //----------------------API PARA ELIMINAR REGLAMENTO incluye file ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/reglamento/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
