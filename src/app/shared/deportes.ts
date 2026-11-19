/** Imagen de una disciplina: assets/img/deportes/NOMBRE.jpg (en mayúsculas y sin tildes). */
export function imagenDeporte(nombre: string | null | undefined): string {
  const archivo = String(nombre || 'DEPORTE GENERICO')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .trim();
  return 'assets/img/deportes/' + archivo + '.jpg';
}
export const IMAGEN_DEPORTE_GENERICA = 'assets/img/deportes/DEPORTE GENERICO.jpg';
