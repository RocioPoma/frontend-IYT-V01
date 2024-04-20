import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Noticia } from '../model/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA LISTAR TODAS LAS NOTICIA ------------------------------
  getNoticias() {
    return this.httpClient.get(this.url + "/noticia/get/")
  }

  //----------------------API PARA LISTAR NOTICIAS DE UN CAMPEONATO ESPECIFICO ------------------------
  getNoticiaCampeonato(id_campeonato: any) {
    return this.httpClient.get(this.url + "/noticia/getnoticiacampeonato/" + id_campeonato);
  }
  

  //----------------------API PARA AGREGAR NOTICIA ------------------------------
  /*add(data: any) {
    return this.httpClient.post(this.url +
      "/noticia/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
  */
  add(data: any, imagen: File) {
    const fd = new FormData();
    fd.append('titulo', data.titulo);
    fd.append('descripcion', data.descripcion);
    fd.append('id_campeonato', data.id_campeonato);
    fd.append('imagen', imagen);
    return this.httpClient.post(this.url +
      "/noticia/add/", fd);
  }

  //----------------------API PARA MODIFICAR NOTICIA ------------------------------
  /*update(data: any) {
    return this.httpClient.patch(this.url +
      "/noticia/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }*/
  update(data: any, imagen: File) {
    const fd = new FormData();
    fd.append('id', data.id);
    fd.append('titulo', data.titulo);
    fd.append('descripcion', data.descripcion);
    fd.append('nombreimg', data.nombreimg);
    fd.append('id_campeonato', data.id_campeonato);
    fd.append('imagen', imagen);
    return this.httpClient.patch(this.url +
      "/noticia/update/", fd);
  }


  //----------------------API PARA ELIMINAR NOTICIA ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/noticia/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
