// Reportes PDF con el mismo formato para todos los módulos (RF02.7, RF03.6, RF07.6, RF08.6, RF09.6, RF10.5, RF11.6...).
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { leerToken } from './permisos';

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
  const ancho = doc.internal.pageSize.getWidth();
  const alto = doc.internal.pageSize.getHeight();
  const usuario = leerToken()?.nombre || '';
  const fecha = new Date().toLocaleString('es-BO');

  autoTable(doc, {
    head: [o.columnas],
    body: o.filas.map((f) => f.map((v) => (v === null || v === undefined ? '' : String(v)))),
    startY: o.subtitulo ? 34 : 30,
    margin: { top: 30, bottom: 18 },
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [0, 105, 92], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didDrawPage: () => {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('INTEGRACIÓN YARETANENSE', ancho / 2, 14, { align: 'center' });
      doc.setFontSize(11);
      doc.text(o.titulo, ancho / 2, 21, { align: 'center' });
      if (o.subtitulo) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(o.subtitulo, ancho / 2, 27, { align: 'center' });
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Generado: ${fecha}${usuario ? '  ·  Usuario: ' + usuario : ''}`, 14, alto - 8);
    },
  });

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Página ${i} de ${total}`, ancho - 14, alto - 8, { align: 'right' });
  }
  doc.save(`${o.archivo}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
