import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EquipoJugadorService } from 'src/app/servicios/equipo-jugador.service';
import { EquipoService } from 'src/app/servicios/equipo.service';
import { JugadorService } from 'src/app/servicios/jugador.service';
import { SnackbarService } from 'src/app/servicios/snackbar.service';
import { GlobalCostants } from 'src/app/shared/global-constants';

//reporte
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-jugador-equipo',
  templateUrl: './jugador-equipo.component.html',
  styleUrls: ['./jugador-equipo.component.scss']
})
export class JugadorEquipoComponent implements OnInit {
  displayedColumnsCheck: string[] = ['nombre'];
  displayedColumns: string[] = ['numero', 'nombre', 'edad'];
  action: any = "Agregar";
  dataSource: any;
  dataEquipoJugador: any;

  onAdd = new EventEmitter();
  onEdit = new EventEmitter();
  equipoForm: any = FormGroup;
  responseMessage: any;

  jugador: any;
  disciplina: any;

  //-----PARA REPORTES
  userName: string = 'Rocio Poma Silvestre';

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private equipoJugadorService: EquipoJugadorService,
    private formBuilder: FormBuilder,
    private jugadorService: JugadorService,
    private dialogRef: MatDialogRef<JugadorEquipoComponent>,
    private snackbarService: SnackbarService) { }


  ngOnInit(): void {
    this.disciplina = (this.dialogData.data_categoria.nombre_disciplina + ' ' + this.dialogData.data_categoria.nombre_categoria).toUpperCase();
    this.getEquipoJugador();
    if (this.dialogData.action === 'addJugador') {
      this.action = (this.dialogData.data_equipo.nombre_club).toUpperCase(); //Club
      console.log('datos Equipo ' + JSON.stringify(this.dialogData.data_equipo));
      console.log('datos Categoria (CONTEMPLA) ' + JSON.stringify(this.dialogData.data_categoria));
      this.getJugadoresByEdad(this.dialogData.data_equipo.id_club);
    }
  }


  //----------------------OPTENEMOS LISTA DE JUGADORES DE UN CLUB ESPECIFICO

  getJugadoresByEdad(id_club: any) {
    var data = {
      id_club: id_club,
      sexo: this.dialogData.data_categoria.genero,
      edad_min: this.dialogData.data_categoria.edad_min,
      edad_max: this.dialogData.data_categoria.edad_max,
    }
    this.jugadorService.getJugadoresByEdad(data.id_club, data.sexo, data.edad_min, data.edad_max).subscribe((response: any) => {
      this.dataSource = response;
    }, (error: any) => {
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalCostants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalCostants.error);
    });
  }

  //---------------------LISTA DE JUGADORES DE UN EQUIPO -----------------------------------------
  getEquipoJugador() {
    this.equipoJugadorService.get(this.dialogData.data_equipo.id_club, this.dialogData.data_equipo.id_contempla).subscribe((response: any) => {
      this.dataEquipoJugador = response;
    });
  }

  //------------------------------------------------------------------------------------------------
  handleSubmit() {
    this.dialogRef.close();
    this.onAdd.emit();
    this.responseMessage = 'Datos guardado correctamente';
    this.snackbarService.openSnackBar(this.responseMessage, "success");
  }

  //------------AGREGAR O ELIMINAR JUGADORES
  add_or_delete(checked: any, ci: any) {
    var data = {
      id_club: this.dialogData.data_equipo.id_club,
      id_contempla: this.dialogData.data_equipo.id_contempla,
      ci: ci,
    }
    if (checked) {
      this.equipoJugadorService.add(data).subscribe((response: any) => {
        console.log("AGREGADO CORRECTAMENTE");
        this.getEquipoJugador();
      })
    } else {
      this.equipoJugadorService.delete(data.id_club, data.id_contempla, data.ci).subscribe((response: any) => {
        console.log("ELIMINADO CORRECTAMENTE");
        this.getEquipoJugador();
      })
    }
    console.log("value1: " + checked);
    console.log("value2 " + ci);
  }

  //----------------COMPROBAR SI EL JUGADOR YA ESTA AGREGADO EN EL EQUIPO
  comprobarSiExiste(ci: any) {
    let estado = false;
    let tamaño = Object.keys(this.dataEquipoJugador).length;
    for (let i = 0; i < tamaño; i++) {
      if (ci == this.dataEquipoJugador[i].ci) {
        estado = true;
        break;
      }
      else {
        estado = false;
      }
    }
    return estado;
  }


  //----------------- GENERAR REPORTE-NOMINA DE JUGADOR POR DISCIPLINA Y CLUB
  generatePDF() {
    const doc = new jsPDF();

    // Obtener los datos filtrados
    const filteredData = this.dataEquipoJugador;

    // Cargar la imagen del logo desde la carpeta de assets
    const logoImg = new Image();
    logoImg.src = '../../../assets/img/logo2_1.png'; // Ruta de la imagen en tu proyecto

    logoImg.onload = () => {

      // Agregar el encabezado con el logo, usuario y fecha
      doc.addImage(logoImg, 'PNG', 150, 2, 40, 25);// Ajusta la posición y tamaño según sea necesario
      doc.setFontSize(12);
      doc.text('NÓMINA ' + this.disciplina + ' CLUB ' + this.action, 50, 28);

      const date = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado por: ${this.userName}`, 15, 10);
      doc.text(`Fecha: ${date}`, 15, 15);

      // Función para agregar encabezado y pie de página en cada página
      const addHeaderAndFooter = () => {

        // Agregar numeración de página en el pie de página
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(`Página ${i}`, 100, doc.internal.pageSize.getHeight() - 10);
        }
      };

      // Agregar el encabezado antes de crear la tabla
      addHeaderAndFooter();

      // Definir las columnas para la tabla
      const columns = ['Nº', 'CI', 'Nombre', 'Edad', 'Fecha de Nacimiento', 'Club', 'Firma      .'];

      // Mapear los datos filtrados para agregar el índice de numeración
      const rows = filteredData.map((item, index) => [
        index + 1,
        item.ci,
        item.nombre + ' ' + item.ap_paterno + ' ' + item.ap_materno,
        item.edad,
        item.fecha_nac,
        this.action //CLUB
      ]);

      // Agregar la tabla al PDF usando autoTable
      (doc as any).autoTable({
        head: [columns],
        body: rows,
        startY: 30, // Ajusta la posición de inicio de la tabla
        theme: 'striped',
        didDrawPage: (data) => {
          // Volver a agregar el encabezado y pie de página en cada página nueva creada por autoTable
          addHeaderAndFooter();
        }
      });

      // Guardar el PDF
      //doc.save('reporte.pdf');
      doc.save('NÓMINA-' + this.disciplina + '-' + this.action + '.pdf')
    };
  }

  //----------------- GENERAR CARNETS DE JUGADOR POR DISCIPLINA

  generateCarnetsPDF1() {
    const doc = new jsPDF('portrait', 'mm', 'a4'); // Documento A4 en milímetros

    const carnetWidth = 90;  // 9 cm de ancho
    const carnetHeight = 80; // 8 cm de alto

    const carnetsPorFila = 2; // Dos carnets por fila
    const carnetsPorColumna = 3; // Tres carnets por columna
    const espacioEntreCarnets = 10; // Espacio entre carnets en mm

    const jugadores = [
      { nombre: 'Jugador 1', numero: '...', disciplina: 'Fútbol' },
      { nombre: 'Jugador 2', numero: '...', disciplina: 'Baloncesto' },
      { nombre: 'Jugador 3', numero: '...', disciplina: 'Vóley' },
      { nombre: 'Jugador 4', numero: '...', disciplina: 'Natación' },
      { nombre: 'Jugador 5', numero: '...', disciplina: 'Tenis' },
      { nombre: 'Jugador 6', numero: '...', disciplina: 'Ajedrez' },
      // Añade más jugadores según lo necesario
    ];

    // Obtener los datos filtrados
    const filteredData = this.dataEquipoJugador;

    let posX = 10; // Posición inicial en X
    let posY = 10; // Posición inicial en Y

    filteredData.forEach((jugador, index) => {
      // Crear borde del carnet
      doc.rect(posX, posY, carnetWidth, carnetHeight);

      // Cuadro para la foto (3x3 cm)
      doc.rect(posX + 5, posY + 5, 30, 30); // Posición de la foto

      // Título: Disciplina
      doc.setFontSize(10);
      doc.text('Disciplina: ' + this.disciplina + this.action, posX + 5, posY + 45);

      // Nombre del jugador
      doc.setFontSize(12);
      doc.text('Nombre: ' + jugador.nombre + ' ' + jugador.ap_paterno + ' ' + jugador.ap_materno, posX + 5, posY + 55);

      // Número de camiseta
      doc.setFontSize(12);
      doc.text('Nro. Camiseta: ' + '.......', posX + 5, posY + 65);

      // Espacio para firma
      doc.text('Firma: __________________', posX + 5, posY + 75);

      // Ajustar posición para el siguiente carnet
      posX += carnetWidth + espacioEntreCarnets; // Mover a la siguiente columna

      // Si alcanzamos el límite de carnets por fila, pasar a la siguiente fila
      if ((index + 1) % carnetsPorFila === 0) {
        posX = 10; // Resetea la posición X para la siguiente fila
        posY += carnetHeight + espacioEntreCarnets; // Mueve a la siguiente fila

        // Si también llegamos al límite de carnets por columna, crear una nueva página
        if ((index + 1) % (carnetsPorFila * carnetsPorColumna) === 0) {
          doc.addPage(); // Añadir nueva página si se excede el espacio vertical
          posX = 10; // Resetea la posición X
          posY = 10; // Resetea la posición Y
        }
      }
    });

    // Guardar el PDF
    //doc.save('carnets_jugadores.pdf');
    doc.save('CARNETS-' + this.disciplina + '-' + this.action + '.pdf')
  }


  generateCarnetsPDF2() {
    const doc = new jsPDF('portrait', 'mm', 'a4'); // Documento A4 en milímetros

    const carnetWidth = 100;  // 10 cm de ancho
    const carnetHeight = 80; // 8 cm de alto

    const carnetsPorFila = 2; // Dos carnets por fila
    const carnetsPorColumna = 3; // Tres carnets por columna
    const espacioEntreCarnets = 3; // Espacio entre carnets en mm

    const jugadores = [
      { nombre: 'Juan', apellidos: 'Pérez García', numero: 10, club: 'Club A', disciplina: 'Fútbol 8' },
      { nombre: 'Carlos', apellidos: 'Lopez Sánchez', numero: 7, club: 'Club B', disciplina: 'Fútbol 8' },
      // Añade más jugadores según lo necesario
    ];

    // Obtener datos de jugadores seleccionados
    const filteredData = this.dataEquipoJugador;

    let posX = 10; // Posición inicial en X
    let posY = 10; // Posición inicial en Y

    filteredData.forEach((jugador, index) => {
      // Dibujar fondo de color rojo con azul matizado
      doc.setFillColor(255, 0, 0); // Color rojo
      doc.rect(posX, posY, carnetWidth, carnetHeight, 'F'); // Fondo rojo

      // Superponer un rectángulo azul
      doc.setFillColor(0, 0, 255); // Color azul
      doc.rect(posX, posY + carnetHeight * 0.2, carnetWidth, carnetHeight * 0.8, 'F'); // Fondo azul en la parte inferior

      // Encabezado en negrita y centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // Color blanco
      doc.text('CAMPEONATO DE INTEGRACIÓN GESTIÓN 2024', posX + carnetWidth / 2, posY + 10, { align: 'center' });

      // Subtítulo centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('CARNET DE JUGADOR FUTBOL 8', posX + carnetWidth / 2, posY + 20, { align: 'center' });

      // Cuadro para la foto (3x3 cm)
      doc.setTextColor(0, 0, 0); // Cambiar color de texto a negro
      doc.rect(posX + 5, posY + 25, 30, 30); // Posición de la foto

      // Información del jugador a la derecha de la foto
      doc.setFontSize(10);
      doc.text(`Club: ${this.action}`, posX + 40, posY + 30);
      doc.text(`Nombre: ${jugador.nombre}`, posX + 40, posY + 35);
      doc.text(`Apellidos: ${jugador.ap_paterno + ' ' + jugador.ap_materno}`, posX + 40, posY + 40);
      doc.text(`Nro. Camiseta: ${'.......'}`, posX + 40, posY + 45);

      // Espacio para firmas en la misma fila, centradas
      const firmaPosY = posY + 70; // Posición Y de las firmas
      const firmaWidth = 25; // Ancho de cada firma

      // Líneas para las firmas
      doc.line(posX + 10, firmaPosY, posX + 10 + firmaWidth, firmaPosY); // Firma Presidente
      doc.line(posX + 35, firmaPosY, posX + 35 + firmaWidth, firmaPosY); // Firma Jugador
      doc.line(posX + 60, firmaPosY, posX + 60 + firmaWidth, firmaPosY); // Firma Comité Técnico

      // Textos debajo de las líneas de firma
      doc.setFontSize(8);
      doc.text('Presidente', posX + 10, firmaPosY + 5);
      doc.text('Jugador', posX + 35, firmaPosY + 5);
      doc.text('Comité Técnico', posX + 60, firmaPosY + 5);

      // Ajustar posición para el siguiente carnet
      posX += carnetWidth + espacioEntreCarnets; // Mover a la siguiente columna

      // Si alcanzamos el límite de carnets por fila, pasar a la siguiente fila
      if ((index + 1) % carnetsPorFila === 0) {
        posX = 10; // Resetea la posición X para la siguiente fila
        posY += carnetHeight + espacioEntreCarnets; // Mueve a la siguiente fila

        // Si también llegamos al límite de carnets por columna, crear una nueva página
        if ((index + 1) % (carnetsPorFila * carnetsPorColumna) === 0) {
          doc.addPage(); // Añadir nueva página si se excede el espacio vertical
          posX = 10; // Resetea la posición X
          posY = 10; // Resetea la posición Y
        }
      }
    });

    // Guardar el PDF
    doc.save('carnets_jugadores.pdf');
  }

  generateCarnetsPDF3() {
    const doc = new jsPDF('portrait', 'mm', 'a4'); // Documento A4 en milímetros
  
    const carnetWidth = 90;  // 9 cm de ancho
    const carnetHeight = 80; // 8 cm de alto
  
    const carnetsPorFila = 2; // Dos carnets por fila
    const carnetsPorColumna = 3; // Tres carnets por columna
    const espacioEntreCarnets = 10; // Espacio entre carnets en mm
  
    const jugadores = [
      { nombre: 'Juan', apellidos: 'Pérez García', numero: 10, club: 'Club A', disciplina: 'Fútbol 8' },
      { nombre: 'Carlos', apellidos: 'Lopez Sánchez', numero: 7, club: 'Club B', disciplina: 'Fútbol 8' },
      // Añade más jugadores según sea necesario
    ];
  
    let posX = 10; // Posición inicial en X
    let posY = 10; // Posición inicial en Y
  
    jugadores.forEach((jugador, index) => {
      // Dibujar fondo de color rojo
      doc.setFillColor(255, 0, 0); // Color rojo
      doc.rect(posX, posY, carnetWidth, carnetHeight * 0.2, 'F'); // Fondo rojo (20%)
  
      // Dibujar fondo azul en la parte inferior
      doc.setFillColor(0, 0, 255); // Color azul
      doc.rect(posX, posY + carnetHeight - 5, carnetWidth, 5, 'F'); // Fondo azul (5 mm)
  
      // Encabezado en negrita y centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // Color blanco
      doc.text('CAMPEONATO DE INTEGRACIÓN GESTIÓN 2024', posX + carnetWidth / 2, posY + 10, { align: 'center' });
  
      // Subtítulo centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('CARNET DE JUGADOR FUTBOL 8', posX + carnetWidth / 2, posY + 20, { align: 'center' });
  
      // Cuadro para la foto (3x3 cm)
      doc.setTextColor(0, 0, 0); // Cambiar color de texto a negro
      doc.rect(posX + 5, posY + 25, 30, 30); // Posición de la foto
  
      // Información del jugador a la derecha de la foto
      doc.setFontSize(10);
      doc.text(`Club: ${jugador.club}`, posX + 40, posY + 30);
      doc.text(`Nombre: ${jugador.nombre}`, posX + 40, posY + 35);
      doc.text(`Apellidos: ${jugador.apellidos}`, posX + 40, posY + 40);
      doc.text(`Nro. Camiseta: ${jugador.numero}`, posX + 40, posY + 45);
  
      // Espacio para firmas en la misma fila, centradas
      const firmaPosY = posY + 70; // Posición Y de las firmas
      const firmaWidth = 25; // Ancho de cada firma
      const firmaGap = 4; // Separación entre las firmas en mm
  
      // Líneas para las firmas
      doc.line(posX + 10, firmaPosY, posX + 10 + firmaWidth, firmaPosY); // Firma Presidente
      doc.line(posX + 10 + firmaWidth + firmaGap, firmaPosY, posX + 10 + firmaWidth + firmaGap + firmaWidth, firmaPosY); // Firma Jugador
      doc.line(posX + 10 + (firmaWidth + firmaGap) * 2, firmaPosY, posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth, firmaPosY); // Firma Comité Técnico
  
      // Textos debajo de las líneas de firma
      doc.setFontSize(8);
      doc.text('Presidente', posX + 10, firmaPosY + 5);
      doc.text('Jugador', posX + 10 + firmaWidth + firmaGap, firmaPosY + 5);
      doc.text('Comité Técnico', posX + 10 + (firmaWidth + firmaGap) * 2, firmaPosY + 5);
  
      // Ajustar posición para el siguiente carnet
      posX += carnetWidth + espacioEntreCarnets; // Mover a la siguiente columna
  
      // Si alcanzamos el límite de carnets por fila, pasar a la siguiente fila
      if ((index + 1) % carnetsPorFila === 0) {
        posX = 10; // Resetea la posición X para la siguiente fila
        posY += carnetHeight + espacioEntreCarnets; // Mueve a la siguiente fila
  
        // Si también llegamos al límite de carnets por columna, crear una nueva página
        if ((index + 1) % (carnetsPorFila * carnetsPorColumna) === 0) {
          doc.addPage(); // Añadir nueva página si se excede el espacio vertical
          posX = 10; // Resetea la posición X
          posY = 10; // Resetea la posición Y
        }
      }
    });
  
    // Guardar el PDF
    doc.save('carnets_jugadores.pdf');
  }

  generateCarnetsPDF4() {
    const doc = new jsPDF('portrait', 'mm', 'a4'); // Documento A4 en milímetros
  
    const carnetWidth = 90;  // 9 cm de ancho
    const carnetHeight = 80; // 8 cm de alto
  
    const carnetsPorFila = 2; // Dos carnets por fila
    const carnetsPorColumna = 3; // Tres carnets por columna
    const espacioEntreCarnets = 10; // Espacio entre carnets en mm
  
   

     // Obtener los datos filtrados
     const DataEJ = this.dataEquipoJugador;
  
    let posX = 10; // Posición inicial en X
    let posY = 10; // Posición inicial en Y
  
    DataEJ.forEach((jugador, index) => {
      // Dibujar fondo de color rojo
      doc.setFillColor(0, 0, 255); // Color azul
      doc.rect(posX, posY, carnetWidth, carnetHeight * 0.2, 'F'); // Fondo rojo (20%)
  
      // Dibujar fondo azul en la parte inferior
      doc.setFillColor(255, 0, 0); // Color rojo
      doc.rect(posX, posY + carnetHeight - 2, carnetWidth, 2, 'F'); // Fondo azul (5 mm)
  
      // Dibujar borde negro
      doc.setDrawColor(0, 0, 0); // Color negro
      doc.rect(posX, posY, carnetWidth, carnetHeight, 'S'); // Borde del carnet
  
      // Encabezado en negrita y centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // Color blanco
      doc.text('CAMPEONATO DE INTEGRACION 2024', posX + carnetWidth / 2, posY + 10, { align: 'center' });
  
      // Subtítulo centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('CARNET DE JUGADOR FUTBOL', posX + carnetWidth / 2, posY + 20, { align: 'center' });
  
      // Cuadro para la foto (3x3 cm)
      doc.setTextColor(0, 0, 0); // Cambiar color de texto a negro
      doc.rect(posX + 5, posY + 25, 30, 30); // Posición de la foto
  
      // Información del jugador a la derecha de la foto
      doc.setFontSize(10);
      doc.text(`Club: ${this.action}`, posX + 40, posY + 30);
      doc.text(`Nombre: ${jugador.nombre}`, posX + 40, posY + 35);
      doc.text(`Apellidos: ${jugador.ap_paterno + ' ' + jugador.ap_materno}`, posX + 40, posY + 40);
      doc.text(`Nro. Camiseta: ${'.......'}`, posX + 40, posY + 45);
  
      // Espacio para firmas en la misma fila, centradas
      const firmaPosY = posY + 70; // Posición Y de las firmas
      const firmaWidth = 25; // Ancho de cada firma
      const firmaGap = 2; // Separación entre las firmas en mm
  
      // Líneas para las firmas
      doc.line(posX + 3, firmaPosY, posX + 10 + firmaWidth, firmaPosY); // Firma Presidente
      doc.line(posX + 10 + firmaWidth + firmaGap, firmaPosY, posX + 10 + firmaWidth + firmaGap + firmaWidth, firmaPosY); // Firma Jugador
      doc.line(posX + 10 + (firmaWidth + firmaGap) * 2, firmaPosY, posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth, firmaPosY); // Firma Comité Técnico
  
      // Textos debajo de las líneas de firma, alineados con las líneas
      doc.setFontSize(8);
      doc.text('Presidente', posX + 0 + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
      doc.text('Jugador', posX + 10 + firmaWidth + firmaGap + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
      doc.text('Comité Técnico', posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
  
      // Ajustar posición para el siguiente carnet
      posX += carnetWidth + espacioEntreCarnets; // Mover a la siguiente columna
  
      // Si alcanzamos el límite de carnets por fila, pasar a la siguiente fila
      if ((index + 1) % carnetsPorFila === 0) {
        posX = 10; // Resetea la posición X para la siguiente fila
        posY += carnetHeight + espacioEntreCarnets; // Mueve a la siguiente fila
  
        // Si también llegamos al límite de carnets por columna, crear una nueva página
        if ((index + 1) % (carnetsPorFila * carnetsPorColumna) === 0) {
          doc.addPage(); // Añadir nueva página si se excede el espacio vertical
          posX = 10; // Resetea la posición X
          posY = 10; // Resetea la posición Y
        }
      }
    });
  
    // Guardar el PDF
    //doc.save('carnets_jugadores.pdf');
    doc.save('CARNETS-' + this.disciplina + '-' + this.action + '.pdf')
  }

  generateCarnetsPDF5() {
    const doc = new jsPDF('portrait', 'mm', 'a4'); // Documento A4 en milímetros
    
    const carnetWidth = 90;  // 9 cm de ancho
    const carnetHeight = 80; // 8 cm de alto
  
    const carnetsPorFila = 2; // Dos carnets por fila
    const carnetsPorColumna = 3; // Tres carnets por columna
    const espacioEntreCarnets = 10; // Espacio entre carnets en mm
  
    // Aquí va tu imagen en formato base64
    const imgBase64 = "data:image/png;base64,..."; // Base64 de tu imagen
    
    const DataEJ = this.dataEquipoJugador;
    
    let posX = 10; // Posición inicial en X
    let posY = 10; // Posición inicial en Y
    
    DataEJ.forEach((jugador, index) => {
      // Agregar imagen de fondo
      doc.addImage(imgBase64, 'PNG', posX, posY, carnetWidth, carnetHeight); // Imagen ajustada al tamaño del carnet
    
      // Dibujar fondo azul en la parte superior
      doc.setFillColor(0, 0, 255); // Color azul
      doc.rect(posX, posY, carnetWidth, carnetHeight * 0.2, 'F'); // Fondo azul (20%)
      
      // Dibujar borde negro
      doc.setDrawColor(0, 0, 0); // Color negro
      doc.rect(posX, posY, carnetWidth, carnetHeight, 'S'); // Borde del carnet
    
      // Encabezado en negrita y centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255); // Color blanco
      doc.text('CAMPEONATO DE INTEGRACION 2024', posX + carnetWidth / 2, posY + 10, { align: 'center' });
    
      // Subtítulo centrado
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('CARNET DE JUGADOR FUTBOL', posX + carnetWidth / 2, posY + 20, { align: 'center' });
    
      // Cuadro para la foto (3x3 cm)
      doc.setTextColor(0, 0, 0); // Cambiar color de texto a negro
      doc.rect(posX + 5, posY + 25, 30, 30); // Posición de la foto
    
      // Información del jugador a la derecha de la foto
      doc.setFontSize(10);
      doc.text(`Club: ${this.action}`, posX + 40, posY + 30);
      doc.text(`Nombre: ${jugador.nombre}`, posX + 40, posY + 35);
      doc.text(`Apellidos: ${jugador.ap_paterno + ' ' + jugador.ap_materno}`, posX + 40, posY + 40);
      doc.text(`Nro. Camiseta: ${'.......'}`, posX + 40, posY + 45);
    
      // Espacio para firmas en la misma fila, centradas
      const firmaPosY = posY + 70; // Posición Y de las firmas
      const firmaWidth = 25; // Ancho de cada firma
      const firmaGap = 2; // Separación entre las firmas en mm
    
      // Líneas para las firmas
      doc.line(posX + 3, firmaPosY, posX + 10 + firmaWidth, firmaPosY); // Firma Presidente
      doc.line(posX + 10 + firmaWidth + firmaGap, firmaPosY, posX + 10 + firmaWidth + firmaGap + firmaWidth, firmaPosY); // Firma Jugador
      doc.line(posX + 10 + (firmaWidth + firmaGap) * 2, firmaPosY, posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth, firmaPosY); // Firma Comité Técnico
    
      // Textos debajo de las líneas de firma, alineados con las líneas
      doc.setFontSize(8);
      doc.text('Presidente', posX + 0 + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
      doc.text('Jugador', posX + 10 + firmaWidth + firmaGap + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
      doc.text('Comité Técnico', posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
    
      // Ajustar posición para el siguiente carnet
      posX += carnetWidth + espacioEntreCarnets; // Mover a la siguiente columna
    
      // Si alcanzamos el límite de carnets por fila, pasar a la siguiente fila
      if ((index + 1) % carnetsPorFila === 0) {
        posX = 10; // Resetea la posición X para la siguiente fila
        posY += carnetHeight + espacioEntreCarnets; // Mueve a la siguiente fila
    
        // Si también llegamos al límite de carnets por columna, crear una nueva página
        if ((index + 1) % (carnetsPorFila * carnetsPorColumna) === 0) {
          doc.addPage(); // Añadir nueva página si se excede el espacio vertical
          posX = 10; // Resetea la posición X
          posY = 10; // Resetea la posición Y
        }
      }
    });
  
    // Guardar el PDF
    doc.save('CARNETS-' + this.disciplina + '-' + this.action + '.pdf');
  }
  
  
  generateCarnetsPDF() {
    const doc = new jsPDF('portrait', 'mm', 'legal'); // Documento Oficio en milímetros    
    const carnetWidth = 100;  // 9 cm de ancho
    const carnetHeight = 90; // 8 cm de alto
    
    const carnetsPorFila = 2; // Dos carnets por fila
    const carnetsPorColumna = 3; // Tres carnets por columna
    const espacioEntreCarnets = 3; // Espacio entre carnets en mm
  
    const logoImg = new Image();
    logoImg.src = '../../../assets/img/FONDO-DE-CARNET.png';
  
    // Esperar a que la imagen se cargue
    logoImg.onload = () => {
      const DataEJ = this.dataEquipoJugador;
      
      let posX = 7; // Posición inicial en X
      let posY = 10; // Posición inicial en Y
      
      DataEJ.forEach((jugador, index) => {
        // Agregar imagen de fondo
        doc.addImage(logoImg, 'PNG', posX, posY, carnetWidth, carnetHeight); // Imagen ajustada al tamaño del carnet
        
        // Dibujar fondo azul en la parte superior
        //doc.setFillColor(0, 0, 255); // Color azul
        //doc.rect(posX, posY, carnetWidth, carnetHeight * 0.2, 'F'); // Fondo azul (20%)
        
        // Dibujar borde negro
        doc.setDrawColor(0, 0, 0); // Color negro
        doc.rect(posX, posY, carnetWidth, carnetHeight, 'S'); // Borde del carnet
        
        // Encabezado en negrita y centrado
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(1, 50, 32); // Color blanco
        doc.text('XX CAMPEONATO', posX + carnetWidth / 2, posY + 9, { align: 'center' });
        doc.text('INTEGRACION YARETANENCE', posX + carnetWidth / 2, posY + 13, { align: 'center' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('JILSTATA-2024', posX + carnetWidth / 2, posY + 17, { align: 'center' });

        
        // Subtítulo centrado
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('CARNET DE JUGADOR ' + this.disciplina, posX + carnetWidth / 2, posY + 21, { align: 'center' });
        
        // Cuadro para la foto (3x3 cm)
        doc.setTextColor(0, 0, 0); // Cambiar color de texto a negro
        doc.rect(posX + 5, posY + 25, 30, 30); // Posición de la foto
        
        // Información del jugador a la derecha de la foto
        doc.setFontSize(10);
        doc.text(`Club: ${this.action}`, posX + 40, posY + 30);
        doc.text(`Nombre: ${jugador.nombre}`, posX + 40, posY + 35);
        doc.text(`Apellidos: ${jugador.ap_paterno + ' ' + jugador.ap_materno}`, posX + 40, posY + 40);
        doc.text(`Nro. Camiseta: ${'.......'}`, posX + 40, posY + 45);
        
        // Espacio para firmas en la misma fila, centradas
        const firmaPosY = posY + 67; // Posición Y de las firmas
        const firmaWidth = 25; // Ancho de cada firma
        const firmaGap = 2; // Separación entre las firmas en mm
        
        // Líneas para las firmas
        doc.line(posX + 7, firmaPosY, posX + 10 + firmaWidth, firmaPosY); // Firma Presidente
        doc.line(posX + 10 + firmaWidth + firmaGap, firmaPosY, posX + 10 + firmaWidth + firmaGap + firmaWidth, firmaPosY); // Firma Jugador
        doc.line(posX + 10 + (firmaWidth + firmaGap) * 2, firmaPosY, posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth, firmaPosY); // Firma Comité Técnico
        
        // Textos debajo de las líneas de firma, alineados con las líneas
        doc.setFontSize(8);
        doc.text('Presidente', posX + 7 + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
        doc.text('Jugador', posX + 10 + firmaWidth + firmaGap + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
        doc.text('Comité Técnico', posX + 10 + (firmaWidth + firmaGap) * 2 + firmaWidth / 2, firmaPosY + 5, { align: 'center' });
        
        // Ajustar posición para el siguiente carnet
        posX += carnetWidth + espacioEntreCarnets; // Mover a la siguiente columna
        
        // Si alcanzamos el límite de carnets por fila, pasar a la siguiente fila
        if ((index + 1) % carnetsPorFila === 0) {
          posX = 10; // Resetea la posición X para la siguiente fila
          posY += carnetHeight + espacioEntreCarnets; // Mueve a la siguiente fila
          
          // Si también llegamos al límite de carnets por columna, crear una nueva página
          if ((index + 1) % (carnetsPorFila * carnetsPorColumna) === 0) {
            doc.addPage(); // Añadir nueva página si se excede el espacio vertical
            posX = 10; // Resetea la posición X
            posY = 10; // Resetea la posición Y
          }
        }
      });
  
      // Guardar el PDF
      doc.save('CARNETS-' + this.disciplina + '-' + this.action + '.pdf');
    };
  }
  




}
