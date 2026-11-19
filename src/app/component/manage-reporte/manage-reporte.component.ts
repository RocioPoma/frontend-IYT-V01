import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-manage-reporte',
  templateUrl: './manage-reporte.component.html',
  styleUrls: ['./manage-reporte.component.scss']
})
export class ManageReporteComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
