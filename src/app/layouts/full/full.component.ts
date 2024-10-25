import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';
import { UserService } from 'src/app/servicios/user.service';
import jwt_decode from 'jwt-decode';


/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  usuario: any;
  private _mobileQueryListener: () => void;

  constructor(private campeonatoService: CampeonatoService,
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activeR: ActivatedRoute,
    private userService: UserService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    
    //this.usuario = this.activeR.snapshot.paramMap.get('xnom');
    console.log('Usuario: ' + this.usuario)
    
    this.activeR.params.subscribe(para => {
      this.usuario = para['xnom'];
      console.log('Usuario: ' + this.usuario)
    });

    //this.usuario='Rocio Poma Silvestre'

    const token = localStorage.getItem('token');
    
    if (token) {
      // Decodificar el token y extraer el nombre
      const decodedToken: any = jwt_decode(token);
      this.usuario = decodedToken?.nombre || 'Usuario desconocido';
      
      console.log('Nombre del usuario logueado:', this.usuario);
    } else {
      console.log('No hay token en localStorage');
    }
   // this.usuario='Usuario'
    
    /*
    this.usuario='Rocio Poma Silve'
    this.userService.disparadorDeUser.subscribe(data=>{
      console.log('Usuario: ' + data);
      this.usuario=data;
    })*/

  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() { }

  //------------------------- ADMINISTRAR CAMPEONATO ------------------------
  handleAction() {

    this.campeonatoService.campeonatoEmiter.emit({ data: 0 });
    this.router.navigate(['/integracion/campeonato']);
  }
}
