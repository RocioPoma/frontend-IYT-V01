import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  @Output() disparadorDeUser: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  //----------------------API PARA CREAR USUARIOS--------------------------------
  signup(data: any) {
    return this.httpClient.post(this.url +
      "/user/signup", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //----------------------API PARA LISTAR USUARIOS--------------------------------
  getUsers() {
    return this.httpClient.get(this.url + "/user/get/");
  }

  //----------------------API PARA EDITAR USUARIOS -------------------------------
  update(data: any) {
    return this.httpClient.patch(this.url +
      "/user/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA ELIMINAR USUARIOS -------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/user/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  //----------------------API PARA CAMBIAR ESTADO USUARIOS-------------------------
  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/user/updateStatus", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }


  //----------------------API SI OLVIDO EL PASSWORD--------------------------------
  forgotPassword(data: any) {
    return this.httpClient.post(this.url +
      "/user/forgotPassword", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //----------------------API PARA INICAR SESION--------------------------------
  login(data: any) {
    return this.httpClient.post(this.url +
      "/user/login", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //----------------------API PARA VERIFICAR EL TOKEN--------------------------------
  checkToken() {
    return this.httpClient.get(this.url + "/user/checkToken");
  }

  //----------------------API PARA CAMBIAR CONTRASENA--------------------------------
  changePassword(data: any) {
    return this.httpClient.post(this.url +
      "/user/changePassword", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }


}