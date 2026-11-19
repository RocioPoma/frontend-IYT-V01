/** Las 17 comunidades de la Integración Yaretanense */
export const COMUNIDADES = [
  'Cañavícota', 'Catuyo', 'Cajuata', 'Challgua', 'Challuma', 'Chite', 'Cochevillque', 'Jayocota Vinto',
  'Jilstata', 'Jupacollo', 'Lipipujio', 'Puqui', 'Quitamalla', 'Rodeo', 'Sigualaca', 'Sonturo', 'Tambo Tambillo',
];

/** Compara nombres sin tildes ni mayúsculas ("CAÑAVICOTA" = "Cañavícota") */
export function normalizarNombre(s: string | null | undefined): string {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Número romano en mayúsculas válido (I, II, ..., XX, XXI, ...) */
export const PATRON_ROMANO = /^(?=[MDCLXVI])M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
