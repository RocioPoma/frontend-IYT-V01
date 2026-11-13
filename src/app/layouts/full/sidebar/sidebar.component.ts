import { ChangeDetectorRef, Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Grupo, leerToken, puede } from 'src/app/shared/permisos';
import { MenuItems } from 'src/app/shared/menu-items';
import { CampeonatoItems } from 'src/app/shared/campeonato-items';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  tokenPayload:any;

  private _mobileQueryListener: () => void;
  bandera:any;

  constructor(private campeonatoService: CampeonatoService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems:MenuItems,
    public campeonatoItems:CampeonatoItems
  ) {
    this.tokenPayload = leerToken() || {};
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit():void {
    
    this.campeonatoService.campeonatoEmiter.subscribe(data=>{
      //console.log(data);
      this.bandera=data.data;
    })
  }

  /** Muestra la opción si el usuario tiene el permiso del grupo indicado en el menú. */
  visible(item: { role: string }): boolean {
    return !item.role || puede(item.role as Grupo, this.tokenPayload.role);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
