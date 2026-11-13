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
  enVivo: Partido[] = [];
  proximos: Partido[] = [];
  cargando = true;
  conSesion = !!leerToken();
  imgUrl = environment.apiUrl + '/uploads/img/';
  private temporizador: any;

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
    this.cargarPartidos();
    this.temporizador = setInterval(() => this.cargarPartidos(), 60000);
    this.canchaService.listar(true).subscribe({ next: (c) => (this.canchas = c), error: () => {} });
    this.publico.auspiciadores().subscribe({ next: (a) => (this.auspiciadores = a), error: () => {} });
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
  }

  cargarPartidos(): void {
    this.competencia.proximos(20).subscribe({
      next: (p) => {
        this.enVivo = p.filter((x) => x.estado === 'En vivo');
        this.proximos = p.filter((x) => x.estado !== 'En vivo').slice(0, 8);
      },
      error: () => {},
    });
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
