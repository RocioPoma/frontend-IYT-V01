import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  /** Grupo de permisos que ve la opción (shared/permisos.ts). Vacío = todos los usuarios con sesión. */
  role: string;
}

const MENUITEMS: Menu[] = [
  { state: 'dashboard', name: 'Inicio', icon: 'dashboard', role: '' },
  { state: 'campeonato', name: 'Campeonatos', icon: 'emoji_events', role: '' },
  { state: 'user', name: 'Gestión usuarios', icon: 'people', role: 'ADMIN' },
  { state: 'club', name: 'Gestión clubs', icon: 'category', role: 'GESTION' },
  { state: 'jugador', name: 'Gestión jugadores', icon: 'badge', role: '' },
  { state: 'pase', name: 'Pase jugador', icon: 'swap_horiz', role: 'GESTION' },
  { state: 'reglamento', name: 'Reglamento', icon: 'file_present', role: '' },
  { state: 'disciplina', name: 'Disciplinas', icon: 'sports_soccer', role: 'GESTION' },
  { state: 'arbitro', name: 'Árbitros', icon: 'assignment_ind', role: 'GESTION' },
  { state: 'categoria', name: 'Categorías', icon: 'engineering', role: 'GESTION' },
  { state: 'sitio', name: 'Campos de juego', icon: 'location_on', role: 'GESTION' },
  { state: 'auspiciador', name: 'Auspiciadores', icon: 'card_giftcard', role: 'AUSPICIO' },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
