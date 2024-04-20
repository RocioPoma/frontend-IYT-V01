import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const MENUITEMS = [
    { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
    { state: 'campeonato', name: 'Campeonatos', icon: 'emoji_events', role: 'admin'},
    { state: 'user', name: 'Gestion Usuarios', icon: 'people', role: 'admin'},
    { state: 'club', name: 'Gestion Clubs', icon: 'category', role: 'admin'},
    { state: 'jugador', name: 'Gestion Jugadores', icon: 'badge', role: 'admin'},
    { state: 'pase', name: 'Pase jugador', icon: 'badge', role: 'admin'},
    { state: 'reglamento', name: 'Gestion Normas', icon: 'file_present', role: 'admin'},
    { state: 'disciplina', name: 'Disciplinas', icon: 'sports_soccer', role: 'admin'},
    { state: 'arbitro', name: 'Arbitros', icon: 'assignment_ind', role: 'admin'},
    { state: 'categoria', name: 'Categorias', icon: 'engineering', role: ''},
    { state: 'sitio', name: 'Campo de juego', icon: 'location_on', role: 'admin'}, 
   // { state: 'auspiciador', name: 'Auspiciadores', icon: 'feed', role: ''},
    //{ state: 'reporte', name: 'Reportes', icon: 'list_alt', role: ''}      
];

@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}