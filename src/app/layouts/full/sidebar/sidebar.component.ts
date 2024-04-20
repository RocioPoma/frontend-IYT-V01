import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import jwt_decode from "jwt-decode";
import { MenuItems } from 'src/app/shared/menu-items';
import { CampeonatoItems } from 'src/app/shared/campeonato-items';
import { CampeonatoService } from 'src/app/servicios/campeonato.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  token:any =localStorage.getItem('token');
  tokenPayload:any;

  private _mobileQueryListener: () => void;
  bandera:any;

  constructor(private campeonatoService: CampeonatoService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems:MenuItems,
    public campeonatoItems:CampeonatoItems
  ) {
    this.tokenPayload = jwt_decode(this.token);
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit():void {
    
    this.campeonatoService.campeonatoEmiter.subscribe(data=>{
      //console.log(data);
      this.bandera=data.data;
      console.log("Bandera: " + this.bandera);
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
