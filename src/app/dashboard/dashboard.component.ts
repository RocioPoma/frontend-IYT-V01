import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from '../servicios/dashboard.service';
import { SnackbarService } from '../servicios/snackbar.service';
import { GlobalCostants } from '../shared/global-constants';
import { leerToken, nombreRol } from '../shared/permisos';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage:any;
	data: any;
	nombre = leerToken()?.nombre || '';
	rol = nombreRol(leerToken()?.role);
	esAdmin = leerToken()?.role === 'admin';
	
	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackbarService:SnackbarService) {
			this.ngxService.start();
			this.dashboardData();
	}

	dashboardData(){
		this.dashboardService.getDetails().subscribe((response:any)=>{
			this.ngxService.stop();
			this.data = response;
		},(error:any)=>{
			this.ngxService.stop();
			if(error.error?.message){
				this.responseMessage = error.error?.message;
			}else{
				this.responseMessage = GlobalCostants.genericError;
			}
			this.snackbarService.openSnackBar(this.responseMessage,GlobalCostants.error);
		})
	}
}
