import { COMUNIDADES } from '../shared/comunidades';
import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../component/manage-user/login/login.component';
import { SignupComponent } from '../component/manage-user/signup/signup.component';
import { UserService } from '../servicios/user.service';
import { PublicoService } from '../servicios/publico.service';
import { CompetenciaService, Partido } from '../servicios/competencia.service';
import { CanchaService, Cancha } from '../servicios/cancha.service';
import { environment } from 'src/environments/environment';
import { leerToken } from '../shared/permisos';

/**
 * Página pública (RF01): sin iniciar sesión se puede ver el fixture, los campos de juego,
 * la tabla de posiciones en tiempo real, el ranking de jugadores, las noticias y el medallero.
 */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  campeonatos: any[] = [];
  campeonato: any = null;
  categorias: any[] = [];
  categoria: any = null;
  noticias: any[] = [];
  canchas: Cancha[] = [];
  auspiciadores: any[] = [];
  cargando = true;
  conSesion = !!leerToken();
  imgUrl = environment.apiUrl + '/uploads/img/';
  private temporizador: any;

  /** Menú del portal: "Campeonatos" se abre por defecto */
  seccion: 'campeonatos' | 'sobre' | 'sistema' = 'campeonatos';

  readonly comunidades = COMUNIDADES;

  readonly historia = [
    {
      periodo: 'Gestión 2021',
      titulo: 'Desarrollo e implementación piloto',
      icono: 'rocket_launch',
      texto:
        'Durante esta gestión se desarrolló el sistema y se realizó su primera implementación piloto en la <b>comunidad de Catuyo, ' +
        'con el Club Aurora, liderado por el Sr. Cándido Poma Mamani,</b> esta primera experiencia permitió poner en práctica sus ' +
        'funcionalidades para la gestión de campeonatos deportivos, incluyendo el registro de equipos y jugadores, la conformación ' +
        'de grupos, la generación de fixtures, la programación de partidos y el seguimiento de resultados y tablas de posiciones.',
    },
    {
      periodo: 'Gestión 2024',
      titulo: 'Priorización',
      icono: 'flag',
      texto:
        'Durante esta gestión se priorizó la implementación y utilización del sistema en la <b>comunidad de Jilstata con su Club Litoral, ' +
        'liderado por el Sr. Ivar Nina,</b> ' +
        'estableciéndose su uso obligatorio y estricto para la organización y administración de las actividades deportivas. Esta etapa ' +
        'representó un avance importante en la incorporación de herramientas tecnológicas para la gestión y el control de los campeonatos.',
    },
    {
      periodo: '2025 - Actualidad',
      titulo: '',
      icono: 'verified',
      texto:
        'El sistema constituye una herramienta tecnológica para centralizar y facilitar la administración de los campeonatos deportivos, ' +
        'permitiendo gestionar equipos, jugadores, modalidades de competencia, fixture, resultados, tablas de posiciones, goleadores, ' +
        'tarjetas y estadísticas. Asimismo, facilita la generación de planillas e informes y la difusión de información deportiva, ' +
        'fotografías, videos y noticias relacionadas con los campeonatos.',
    },
  ];

  irA(seccion: 'campeonatos' | 'sobre' | 'sistema'): void {
    this.seccion = seccion;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private publico: PublicoService,
    private competencia: CompetenciaService,
    private canchaService: CanchaService
  ) {}

  ngOnInit(): void {
    this.publico.campeonatos().subscribe({
      next: (c) => {
        this.campeonatos = c;
        const activo = c.find((x) => x.status === 'true') || c[0];
        if (activo) this.elegirCampeonato(activo);
        this.cargando = false;
      },
      error: () => (this.cargando = false),
    });
    this.canchaService.listar(true).subscribe({ next: (c) => (this.canchas = c), error: () => {} });
    this.publico.auspiciadores().subscribe({ next: (a) => (this.auspiciadores = a), error: () => {} });
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }

  elegirCampeonato(c: any): void {
    this.campeonato = c;
    this.categoria = null;
    this.publico.categorias(c.id).subscribe({
      next: (cats) => {
        this.categorias = cats.filter((x) => x.estado !== 'false');
        this.categoria = this.categorias[0] || null;
      },
      error: () => (this.categorias = []),
    });
    this.publico.noticias(c.id).subscribe({ next: (n) => (this.noticias = n), error: () => (this.noticias = []) });
  }

  nombreCategoria(c: any): string {
    return `${c.nombre_disciplina} · ${c.nombre_categoria}${c.genero ? ' · ' + c.genero : ''}`;
  }

  irAlPanel(): void {
    this.router.navigate(['/integracion/dashboard']);
  }

  loginAction(): void {
    this.dialog.open(LoginComponent, { width: '420px' });
  }

  signupAction(): void {
    this.dialog.open(SignupComponent, { width: '550px', data: { action: 'Registrarse', publico: true } });
  }
}
