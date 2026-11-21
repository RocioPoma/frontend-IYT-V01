// Flujos de aprobación: solicitudes de jugadores, inscripción de equipos y pases.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export type EstadoSolicitud = 'borrador' | 'pendiente' | 'aprobado' | 'observado' | 'anulado';

export interface SolicitudJugador {
  id: number;
  tipo: 'alta' | 'actualizacion';
  ci: string;
  id_club: number;
  club: string;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
  fecha_nacimiento: string;
  sexo: string;
  decendencia: string;
  foto: string | null;
  documento: string | null;
  estado: EstadoSolicitud;
  observacion: string | null;
  fecha_solicitud_f: string | null;
  fecha_revision_f: string | null;
  solicitado_por_nombre: string | null;
  revisado_por_nombre: string | null;
  actual_nombre?: string;
  actual_ap_paterno?: string;
  actual_ap_materno?: string;
  actual_fecha_nacimiento?: string;
  actual_sexo?: string;
  actual_decendencia?: string;
  actual_foto?: string;
  actual_documento?: string;
  comunidad_club?: string;
}

type Msg = { message: string; id?: number };

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ---------- Jugadores ----------
  jugadores(filtro: { estado?: string; tipo?: string } = {}): Observable<SolicitudJugador[]> {
    const params: any = {};
    if (filtro.estado) params.estado = filtro.estado;
    if (filtro.tipo) params.tipo = filtro.tipo;
    return this.http.get<SolicitudJugador[]>(`${this.url}/solicitudjugador/get`, { params });
  }

  altaJugador(datos: FormData) {
    return this.http.post<Msg>(`${this.url}/solicitudjugador/alta`, datos);
  }

  actualizarJugador(datos: FormData) {
    return this.http.post<Msg>(`${this.url}/solicitudjugador/actualizacion`, datos);
  }

  editarSolicitud(id: number, datos: FormData) {
    return this.http.patch<Msg>(`${this.url}/solicitudjugador/update/${id}`, datos);
  }

  enviarSolicitud(id: number) {
    return this.http.patch<Msg>(`${this.url}/solicitudjugador/solicitar/${id}`, {});
  }

  anularSolicitud(id: number) {
    return this.http.patch<Msg>(`${this.url}/solicitudjugador/anular/${id}`, {});
  }

  revisarJugador(id: number, decision: 'aceptar' | 'observar', observacion?: string) {
    return this.http.patch<Msg>(`${this.url}/solicitudjugador/revisar/${id}`, { decision, observacion });
  }

  // ---------- Equipos ----------
  equiposPorRevisar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/equipo/solicitudes`);
  }

  solicitarInscripcion(id_club: number, id_contempla: number | string) {
    return this.http.post<Msg>(`${this.url}/equipo/solicitar`, { id_club, id_contempla });
  }

  revisarEquipo(datos: { id_club: number; id_contempla: number | string; estado: 'aprobado' | 'observado' | 'rechazado'; observacion?: string }) {
    return this.http.patch<Msg>(`${this.url}/equipo/revisar`, datos);
  }

  // ---------- Pases ----------
  pases(estado?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/pase/get`, { params: estado ? { estado } : {} });
  }

  buscarJugador(ci: string) {
    return this.http.get<any>(`${this.url}/pase/buscarJugador/${encodeURIComponent(ci)}`);
  }

  solicitarPase(datos: FormData) {
    return this.http.post<Msg>(`${this.url}/pase/solicitar`, datos);
  }

  responderPase(id: number, datos: FormData) {
    return this.http.patch<Msg>(`${this.url}/pase/responder/${id}`, datos);
  }

  revisarPase(id: number, decision: 'aprobar' | 'rechazar', observacion?: string) {
    return this.http.patch<Msg>(`${this.url}/pase/revisar/${id}`, { decision, observacion });
  }

  anularPase(id: number) {
    return this.http.patch<Msg>(`${this.url}/pase/anular/${id}`, {});
  }
}

/** Texto y color de cada estado, para mostrarlos igual en todas las pantallas. */
export const ESTADOS: Record<string, { texto: string; clase: string }> = {
  borrador: { texto: 'Borrador', clase: 'gris' },
  pendiente: { texto: 'En revisión', clase: 'naranja' },
  solicitado: { texto: 'En revisión', clase: 'naranja' },
  aceptado_origen: { texto: 'Aceptado por el club de origen', clase: 'azul' },
  aprobado: { texto: 'Aprobado', clase: 'verde' },
  observado: { texto: 'Observado', clase: 'rojo' },
  rechazado: { texto: 'Rechazado', clase: 'rojo' },
  anulado: { texto: 'Anulado', clase: 'gris' },
};
