import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DcategoriacampeonatoService } from 'src/app/servicios/dcategoriacampeonato.service';

/** Página de una categoría de campeonato: equipos, partidos, fixture, tabla, ranking y medallero. */
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manage-dcategoria-futbol',
  templateUrl: './manage-dcategoria-futbol.component.html',
  styleUrls: ['./manage-dcategoria-futbol.component.scss']
})
export class ManageDcategoriaFutbolComponent implements OnInit {
  dataSource: any = null;
  id_contempla: string | null = '';
  pestana = 0;

  imgURL = '../../../assets/img/deportes/';
  extension = '.jpg';

  constructor(
    private dcategoriacampeonatoService: DcategoriacampeonatoService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id_contempla = params.get('id_contempla');
      this.dcategoriacampeonatoService.getById(this.id_contempla).subscribe({
        next: (res) => (this.dataSource = res),
        error: () => (this.dataSource = null),
      });
    });
  }
}
