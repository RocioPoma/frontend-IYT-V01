// Campos de juego (RF10).
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Cancha {
  id_cancha: number;
  nombre: string;
  direccion: string | null;
  tipo: string | null;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class CanchaService {
  private url = `${environment.apiUrl}/cancha`;

  constructor(private http: HttpClient) {}

  listar(soloActivos = false): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(`${this.url}/get`, { params: soloActivos ? { activos: '1' } : {} });
  }

  agregar(datos: Partial<Cancha>) {
    return this.http.post<{ message: string }>(`${this.url}/add`, datos);
  }

  actualizar(datos: Partial<Cancha>) {
    return this.http.patch<{ message: string }>(`${this.url}/update`, datos);
  }

  cambiarEstado(id_cancha: number, estado: boolean) {
    return this.http.patch<{ message: string }>(`${this.url}/updateStatus`, { id_cancha, estado: String(estado) });
  }

  eliminar(id: number) {
    return this.http.delete<{ message: string }>(`${this.url}/delete/${id}`);
  }
}
