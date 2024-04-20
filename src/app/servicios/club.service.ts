import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  add(data: any) {
    return this.httpClient.post(this.url +
      "/club/add/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  update(data: any) {
    return this.httpClient.patch(this.url +
      "/club/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  getClubs() {
    return this.httpClient.get(this.url + "/club/get/")
  }

  //----------------------API PARA ELIMINAR CLUB ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/club/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
