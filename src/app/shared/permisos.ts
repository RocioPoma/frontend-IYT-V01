// Roles y permisos del sistema (mismos grupos que el backend, según los casos de uso del documento).
import { jwtDecode } from 'jwt-decode';

export type Rol = 'admin' | 'presidente' | 'comite_tecnico' | 'responsable_categoria' | 'delegado';

export const ROLES: { valor: Rol; nombre: string }[] = [
  { valor: 'admin', nombre: 'Administrador' },
  { valor: 'presidente', nombre: 'Presidente' },
  { valor: 'comite_tecnico', nombre: 'Comité técnico' },
  { valor: 'responsable_categoria', nombre: 'Responsable de categoría' },
  { valor: 'delegado', nombre: 'Delegado' },
];

export const GRUPOS = {
  TODOS: ['admin', 'presidente', 'comite_tecnico', 'responsable_categoria', 'delegado'] as Rol[],
  ADMIN: ['admin'] as Rol[],
  GESTION: ['admin', 'comite_tecnico'] as Rol[],
  PARTIDOS: ['admin', 'comite_tecnico', 'responsable_categoria'] as Rol[],
  EQUIPOS: ['admin', 'comite_tecnico', 'delegado'] as Rol[],
  NOTICIAS: ['admin', 'comite_tecnico', 'presidente'] as Rol[],
  AUSPICIO: ['admin', 'comite_tecnico', 'presidente'] as Rol[],
  NORMAS: ['admin', 'presidente'] as Rol[],
};
export type Grupo = keyof typeof GRUPOS;

export interface DatosToken {
  id?: number;
  nombre?: string;
  email?: string;
  role?: string;
  id_club?: number;
  exp?: number;
}

export function leerToken(): DatosToken | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const datos = jwtDecode<DatosToken>(token);
    if (datos.role === 'user') datos.role = 'delegado'; // tokens antiguos
    return datos;
  } catch {
    return null;
  }
}

export function rolActual(): Rol | null {
  return (leerToken()?.role as Rol) || null;
}

export function puede(grupo: Grupo, rol: string | null = rolActual()): boolean {
  return !!rol && (GRUPOS[grupo] as string[]).includes(rol);
}

export function nombreRol(rol: string | null | undefined): string {
  if (rol === 'user') rol = 'delegado';
  return ROLES.find((r) => r.valor === rol)?.nombre || rol || '';
}

/**
 * Compatibilidad con las pantallas existentes, que comparan role === 'admin' / role !== 'user':
 * devuelve 'admin' si el usuario puede modificar en ese módulo y 'user' si solo puede consultar.
 */
export function rolPantalla(grupo: Grupo): 'admin' | 'user' {
  return puede(grupo) ? 'admin' : 'user';
}

/** URL de un documento privado (documento del jugador, hoja de pase): incluye el token de sesión. */
export function urlDocumentoPrivado(base: string, nombre: string): string {
  const token = localStorage.getItem('token') || '';
  return `${base}${encodeURIComponent(nombre)}?token=${encodeURIComponent(token)}`;
}
