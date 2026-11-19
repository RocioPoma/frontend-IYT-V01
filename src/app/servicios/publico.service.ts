// Datos de la vista pública (RF01): no requieren iniciar sesión.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PublicoService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  campeonatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/campeonato/get`);
  }

  categorias(idCampeonato: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/dcategoriacampeonato/get/${idCampeonato}`);
  }

  noticias(idCampeonato: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/noticia/getnoticiacampeonato/${idCampeonato}`);
  }

  auspiciadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/auspiciador/get`);
  }
}
