// Carnets de jugador (hoja oficio, 6 por página). Los datos del encabezado salen del campeonato:
// número en romanos, comunidad anfitriona, gestión y categoría; el logo es el del club anfitrión
// (o el de la integración si no tiene) y la foto es la del jugador registrada en el sistema.
import { jsPDF } from 'jspdf';

export interface DatosCarnets {
  jugadores: { nombre: string; ap_paterno: string; ap_materno: string; foto?: string | null }[];
  club: string;               // equipo / club del jugador
  categoria: string;          // p. ej. "FUTBOL VARONES LIBRES"
  numeroRomano?: string | null;
  comunidadAnfitriona?: string | null;
  gestion?: number | string | null;
  logoAnfitrion?: string | null; // nombre del archivo del logo del club anfitrión
  urlArchivos: string;
  archivo: string;
}

const ANCHO = 100;
const ALTO = 90;
const SEP = 4;
const POR_FILA = 2;
const POR_PAGINA = 6;

/** Carga una imagen y la entrega como dataURL. Con "cuadrado" la recorta al centro (fotos). */
function cargar(url: string, lado: number, cuadrado: boolean, formato: 'image/png' | 'image/jpeg'): Promise<{ datos: string; w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (cuadrado) {
          const m = Math.min(sw, sh);
          sx = (sw - m) / 2; sy = (sh - m) / 2; sw = sh = m;
          c.width = c.height = lado;
        } else {
          const esc = Math.min(1, lado / Math.max(sw, sh));
          c.width = Math.max(1, Math.round(sw * esc));
          c.height = Math.max(1, Math.round(sh * esc));
        }
        const ctx = c.getContext('2d')!;
        if (formato === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
        resolve({ datos: c.toDataURL(formato, 0.85), w: c.width, h: c.height });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function exportarCarnets(d: DatosCarnets): Promise<void> {
  const fondo = await cargar('assets/img/fondo-carnet.jpg', 1024, false, 'image/jpeg');
  const logo =
    (d.logoAnfitrion ? await cargar(d.urlArchivos + d.logoAnfitrion + '?ancho=320', 320, false, 'image/png') : null) ||
    (await cargar('assets/img/logo-iyt.png', 320, false, 'image/png'));
  const fotos = await Promise.all(
    d.jugadores.map((j) => (j.foto ? cargar(d.urlArchivos + j.foto + '?ancho=320', 320, true, 'image/jpeg') : Promise.resolve(null))),
  );

  const doc = new jsPDF('portrait', 'mm', 'legal');
  const anchoPag = doc.internal.pageSize.getWidth();
  const x0 = (anchoPag - (ANCHO * POR_FILA + SEP)) / 2; // carnets centrados
  const y0 = 10;

  const titulo = `${(d.numeroRomano || '').trim().toUpperCase()} CAMPEONATO`.trim();
  const sede = [String(d.comunidadAnfitriona || '').toUpperCase(), d.gestion ? String(d.gestion) : ''].filter(Boolean).join(' - ');

  d.jugadores.forEach((j, i) => {
    const enPagina = i % POR_PAGINA;
    if (i > 0 && enPagina === 0) doc.addPage();
    const x = x0 + (enPagina % POR_FILA) * (ANCHO + SEP);
    const y = y0 + Math.floor(enPagina / POR_FILA) * (ALTO + SEP);

    if (fondo) doc.addImage(fondo.datos, 'JPEG', x, y, ANCHO, ALTO, 'fondo-carnet', 'FAST');
    doc.setDrawColor(0, 0, 0);
    doc.rect(x, y, ANCHO, ALTO, 'S');

    // logo del club anfitrión (o de la integración) arriba a la derecha, sin deformarlo
    if (logo) {
      const caja = 15;
      const esc = Math.min(caja / logo.w, caja / logo.h);
      const w = logo.w * esc, h = logo.h * esc;
      doc.addImage(logo.datos, 'PNG', x + ANCHO - 4 - caja + (caja - w) / 2, y + 4 + (caja - h) / 2, w, h, 'logo-anfitrion', 'FAST');
    }

    // encabezado
    doc.setTextColor(1, 50, 32);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(titulo, x + ANCHO / 2, y + 9, { align: 'center' });
    doc.text('INTEGRACION YARETANENCE', x + ANCHO / 2, y + 13, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    if (sede) doc.text(sede, x + ANCHO / 2, y + 17, { align: 'center' });
    const sub = doc.splitTextToSize('CARNET DE JUGADOR ' + d.categoria.toUpperCase(), ANCHO - 34);
    doc.text(sub[0], x + ANCHO / 2, y + 21, { align: 'center' });

    // foto (3 x 3 cm): la del sistema o el recuadro vacío
    const foto = fotos[i];
    if (foto) doc.addImage(foto.datos, 'JPEG', x + 5, y + 25, 30, 30, undefined, 'FAST');
    doc.setTextColor(0, 0, 0);
    doc.rect(x + 5, y + 25, 30, 30);

    // datos del jugador
    doc.setFontSize(10);
    const ancho = ANCHO - 44;
    let ty = y + 30;
    for (const linea of [
      `Club: ${d.club}`,
      `Nombre: ${j.nombre}`,
      `Apellidos: ${[j.ap_paterno, j.ap_materno].filter(Boolean).join(' ')}`,
      'Nro. Camiseta: .......',
    ]) {
      const partes = doc.splitTextToSize(linea, ancho);
      doc.text(partes, x + 40, ty);
      ty += 5 * partes.length;
    }

    // firmas
    const fy = y + 67;
    const fw = 25, gap = 2.5, fx = x + (ANCHO - (fw * 3 + gap * 2)) / 2;
    doc.setFontSize(8);
    ['Presidente', 'Jugador', 'Comité Técnico'].forEach((t, k) => {
      const lx = fx + k * (fw + gap);
      doc.line(lx, fy, lx + fw, fy);
      doc.text(t, lx + fw / 2, fy + 5, { align: 'center' });
    });
  });

  doc.save(d.archivo);
}
