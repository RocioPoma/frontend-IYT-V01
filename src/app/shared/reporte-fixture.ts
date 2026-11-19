// Reporte PDF del fixture: logo de la integración en el encabezado y, en cada partido, logo y nombre de los clubs.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { dibujarEncabezado, dibujarPies } from './reporte-pdf';

export interface PartidoReporte {
  equipo1: string;
  equipo2: string;
  logo1?: string | null;
  logo2?: string | null;
  ronda?: number | null;
  fecha_f?: string | null;
  hora_f?: string | null;
  nombre_cancha?: string | null;
  estado?: string;
  total_equipo1?: number | null;
  total_equipo2?: number | null;
}

export interface GrupoReporte {
  titulo: string; // p. ej. "SERIE A"
  partidos: PartidoReporte[];
}

/** Carga una imagen (logo de club) y la convierte en PNG cuadrado para el PDF. */
function cargarLogo(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const lado = 96;
        const c = document.createElement('canvas');
        c.width = lado; c.height = lado;
        const ctx = c.getContext('2d')!;
        const esc = Math.min(lado / img.width, lado / img.height);
        const w = img.width * esc, h = img.height * esc;
        ctx.drawImage(img, (lado - w) / 2, (lado - h) / 2, w, h);
        resolve(c.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function exportarFixturePDF(o: {
  titulo: string;
  subtitulo?: string;
  grupos: GrupoReporte[];
  urlArchivos: string;
  archivo: string;
}): Promise<void> {
  // logos de todos los clubs (una sola descarga por logo)
  const nombres = new Set<string>();
  o.grupos.forEach((g) => g.partidos.forEach((p) => { if (p.logo1) nombres.add(p.logo1); if (p.logo2) nombres.add(p.logo2); }));
  const logos: Record<string, string | null> = {};
  await Promise.all([...nombres].map(async (n) => (logos[n] = await cargarLogo(o.urlArchivos + n))));

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const anchoPag = doc.internal.pageSize.getWidth();
  let y = 36;

  for (const g of o.grupos) {
    const rondas = new Map<number, PartidoReporte[]>();
    g.partidos.forEach((p) => {
      const r = p.ronda || 1;
      if (!rondas.has(r)) rondas.set(r, []);
      rondas.get(r)!.push(p);
    });

    const equipos = new Set<string>();
    g.partidos.forEach((p) => { equipos.add(p.equipo1); equipos.add(p.equipo2); });

    for (const [ronda, partidos] of [...rondas.entries()].sort((a, b) => a[0] - b[0])) {
      const juegan = new Set(partidos.flatMap((p) => [p.equipo1, p.equipo2]));
      const descansa = [...equipos].filter((e) => !juegan.has(e));
      const filas = partidos.map((p) => [
        p.equipo1,
        p.estado === 'Cerrado' || p.estado === 'En vivo' ? `${p.total_equipo1 ?? 0}  -  ${p.total_equipo2 ?? 0}` : 'vs',
        p.equipo2,
        p.fecha_f || 'Por definir',
        p.hora_f || '—',
        p.nombre_cancha || '—',
      ]);
      if (y > doc.internal.pageSize.getHeight() - 50) { doc.addPage(); y = 36; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(0, 105, 92);
      const cab = `${g.titulo ? g.titulo + '  ·  ' : ''}FECHA ${ronda}`;
      doc.text(cab, 12, y);
      const anchoCab = doc.getTextWidth(cab);
      if (descansa.length) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(90, 90, 90);
        doc.text(`Descansa: ${descansa.join(', ')}`, 12 + anchoCab + 4, y);
      }
      doc.setTextColor(0, 0, 0);

      autoTable(doc, {
        startY: y + 2,
        head: [['Local', '', 'Visitante', 'Fecha', 'Hora', 'Campo de juego']],
        body: filas,
        margin: { top: 34, bottom: 18, left: 12, right: 12 },
        styles: { fontSize: 9, cellPadding: { top: 3, bottom: 3, left: 2, right: 2 }, valign: 'middle', minCellHeight: 11 },
        headStyles: { fillColor: [0, 105, 92], textColor: 255, halign: 'center' },
        // los encabezados siguen la alineación de su columna
        didParseCell: (c) => { if (c.section === 'head') c.cell.styles.halign = c.column.index === 0 ? 'right' : c.column.index === 2 || c.column.index === 5 ? 'left' : 'center'; },
        alternateRowStyles: { fillColor: [245, 248, 247] },
        columnStyles: {
          0: { cellWidth: 52, halign: 'right', cellPadding: { right: 12, left: 2, top: 3, bottom: 3 }, fontStyle: 'bold' },
          1: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 52, halign: 'left', cellPadding: { left: 12, right: 2, top: 3, bottom: 3 }, fontStyle: 'bold' },
          3: { cellWidth: 22, halign: 'center' },
          4: { cellWidth: 14, halign: 'center' },
          5: { halign: 'left' },
        },
        didDrawPage: () => dibujarEncabezado(doc, o.titulo, o.subtitulo),
        didDrawCell: (c) => {
          if (c.section !== 'body' || (c.column.index !== 0 && c.column.index !== 2)) return;
          const p = partidos[c.row.index];
          const nombre = c.column.index === 0 ? p.logo1 : p.logo2;
          const datos = nombre ? logos[nombre] : null;
          const lado = 7.5;
          const x = c.column.index === 0 ? c.cell.x + c.cell.width - lado - 2.5 : c.cell.x + 2.5;
          const yy = c.cell.y + (c.cell.height - lado) / 2;
          if (datos) {
            doc.addImage(datos, 'PNG', x, yy, lado, lado, 'club-' + nombre, 'FAST'); // alias: se guarda una sola vez
          } else {
            doc.setDrawColor(176, 190, 197);
            doc.setFillColor(224, 242, 241);
            doc.circle(x + lado / 2, yy + lado / 2, lado / 2, 'FD');
          }
        },
      });
      y = (doc as any).lastAutoTable.finalY + 9;
    }
  }

  if (!o.grupos.some((g) => g.partidos.length)) {
    dibujarEncabezado(doc, o.titulo, o.subtitulo);
    doc.text('Todavía no se generó el fixture.', anchoPag / 2, 50, { align: 'center' });
  }
  dibujarPies(doc);
  doc.save(`${o.archivo}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
