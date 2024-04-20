import { Injectable } from "@angular/core";

export interface Menu {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const CAMPEONATOITEMS = [
    { state: 'dcampeonato', name: 'Detalle Campeonato', icon: 'home_work', role: '' },
    { state: 'noticia', name: 'Noticias', icon: 'feed', role: ''},   
    { state: 'dcategoria_campeonato', name: 'Categorias Campeonato', icon: 'engineering', role: ''}, 
    //{ state: 'dcategoria_f', name: 'Categorias Campeonato', icon: 'engineering', role: ''}, 
    { state: 'auspiciador', name: 'Auspiciadores Camp', icon: 'card_giftcard', role: ''}, 
    
];

@Injectable()
export class CampeonatoItems {
    getMenuitem(): Menu[] {
        return CAMPEONATOITEMS;
    }
}