import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  /** Registra un club; el logo (opcional) viaja como archivo. */
  add(data: any, logo?: File | null) {
    return this.httpClient.post(this.url + "/club/add/", this.formulario(data, logo));
  }

  update(data: any, logo?: File | null) {
    return this.httpClient.patch(this.url + "/club/update/", this.formulario(data, logo));
  }

  private formulario(data: any, logo?: File | null): FormData {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
    if (logo) fd.append('logo', logo, logo.name);
    return fd;
  }

  getClubs() {
    return this.httpClient.get(this.url + "/club/get/")
  }

  getClubsConId(id_club: any) {
    return this.httpClient.get(this.url + "/club/get/"+ id_club)
  }

  //----------------------API PARA ELIMINAR CLUB ------------------------------
  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/club/delete/" + id, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }
}
