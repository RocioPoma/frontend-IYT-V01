// Reportes PDF con el mismo formato para todos los módulos (RF02.7, RF03.6, RF07.6, RF08.6, RF09.6, RF10.5, RF11.6...).
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { leerToken } from './permisos';

/** Logo de la integración precargado para el encabezado de todos los reportes. */
const LOGO = typeof Image !== 'undefined' ? new Image() : null;
let LOGO_REDUCIDO: string | null = null; // versión chica (240 px) para que el PDF pese poco
if (LOGO) {
  LOGO.onload = () => {
    try {
      const c = document.createElement('canvas');
      c.width = 240;
      c.height = Math.round(240 * (LOGO.naturalHeight / LOGO.naturalWidth));
      c.getContext('2d')!.drawImage(LOGO, 0, 0, c.width, c.height);
      LOGO_REDUCIDO = c.toDataURL('image/png');
    } catch {
      LOGO_REDUCIDO = null;
    }
  };
  LOGO.src = 'assets/img/logo-iyt.png';
}
export const LOGO_PROPORCION = 455 / 512; // alto / ancho

/** Dibuja el logo (si ya cargó) en la posición indicada, con el ancho en mm. */
export function dibujarLogo(doc: jsPDF, x: number, y: number, ancho: number): void {
  const imagen = LOGO_REDUCIDO || (LOGO && LOGO.complete && LOGO.naturalWidth ? LOGO : null);
  if (imagen) {
    doc.addImage(imagen, 'PNG', x, y, ancho, ancho * LOGO_PROPORCION, 'logo-iyt', 'FAST'); // alias: una sola copia en el PDF
  }
}

/** Encabezado común: logo a la izquierda, nombre de la integración, título y subtítulo centrados. */
export function dibujarEncabezado(doc: jsPDF, titulo: string, subtitulo?: string): void {
  const ancho = doc.internal.pageSize.getWidth();
  dibujarLogo(doc, 12, 6, 22);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('INTEGRACIÓN YARETANENSE', ancho / 2, 13, { align: 'center' });
  doc.setFontSize(11);
  doc.text(titulo, ancho / 2, 20, { align: 'center' });
  if (subtitulo) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(subtitulo, ancho / 2, 26, { align: 'center' });
  }
  doc.setDrawColor(0, 105, 92);
  doc.setLineWidth(0.4);
  doc.line(12, 29, ancho - 12, 29);
  doc.setFont('helvetica', 'normal');
}

/** Pie común: fecha/usuario a la izquierda y número de página a la derecha, en todas las páginas. */
export function dibujarPies(doc: jsPDF): void {
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const usuario = leerToken()?.nombre || '';
  const fecha = new Date().toLocaleString('es-BO');
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(`Generado: ${fecha}${usuario ? '  ·  Usuario: ' + usuario : ''}`, 12, alto - 8);
    doc.text(`Página ${i} de ${total}`, ancho - 12, alto - 8, { align: 'right' });
  }
  doc.setTextColor(0, 0, 0);
}

export interface OpcionesReporte {
  titulo: string;
  columnas: string[];
  filas: (string | number | null | undefined)[][];
  archivo: string;
  orientacion?: 'portrait' | 'landscape';
  subtitulo?: string;
}

export function exportarPDF(o: OpcionesReporte): void {
  const doc = new jsPDF({ orientation: o.orientacion || 'portrait', unit: 'mm', format: 'a4' });

  autoTable(doc, {
    head: [o.columnas],
    body: o.filas.map((f) => f.map((v) => (v === null || v === undefined ? '' : String(v)))),
    startY: 34,
    margin: { top: 34, bottom: 18, left: 12, right: 12 },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [0, 105, 92], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didDrawPage: () => dibujarEncabezado(doc, o.titulo, o.subtitulo),
  });

  dibujarPies(doc);
  doc.save(`${o.archivo}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
