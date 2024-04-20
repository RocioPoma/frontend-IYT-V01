import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }

  //---------------------- API PARA LISTAR ----------------------
  getAllDisciplina() {
    return this.httpClient.get(this.url + "/disciplina/get_all/")
  }

  //---------------------- API PARA LISTAR ----------------------
  getDisciplina() {
    return this.httpClient.get(this.url + "/disciplina/get/")
  }

  //----------------------API PARA ACTUALIZAR ESTADO -------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/disciplina/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

}
