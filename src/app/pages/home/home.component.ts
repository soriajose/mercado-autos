import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Component, ViewChild, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';

interface AutoAttribute {
  id: string;
  value_name: string;
}

interface Auto {
  title: string;
  attributes: AutoAttribute[];
  price: number;
  currency_id: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatCardModule,
    MatInputModule, MatIconModule, MatTooltipModule, MatSortModule, MatToolbarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  autos: Auto[] = [];
  dataSource = new MatTableDataSource(this.autos);
  displayedColumns: string[] = ['marca', 'modelo', 'anio', 'kilometraje', 'precio', 'moneda', 'link'];
  isLoading: boolean = false;
  errorMessage: string = '';
  promedioARS: number = 0;
  promedioUSD: number = 0;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private apiService: ApiService) {
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  buscarAutos(query: string) {
    this.isLoading = true;

    this.apiService.getAutos(query).subscribe(
      (data: any) => {
      
        this.isLoading = false;
        this.autos = data.results.slice(0, 10);
        this.dataSource.data = this.autos; 

        const preciosARS = this.autos.filter(a => a.currency_id === "ARS").map(a => a.price);
        const preciosUSD = this.autos.filter(a => a.currency_id === "USD").map(a => a.price);

        // Calcular promedio
        this.promedioARS = preciosARS.length ? (preciosARS.reduce((acc, precio) => acc + precio, 0) / preciosARS.length) : 0;
        this.promedioUSD = preciosUSD.length ? (preciosUSD.reduce((acc, precio) => acc + precio, 0) / preciosUSD.length) : 0;
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al obtener los autos';
      }
    );
  }


  getAnio(auto: any): string {
    const atributo = auto.attributes.find((a: AutoAttribute) => a.id === 'VEHICLE_YEAR');
    return atributo ? atributo.value_name : 'Desconocido';
  }


  getKilometraje(auto: any): string {
    const atributo = auto.attributes.find((a: AutoAttribute) => a.id === 'KILOMETERS');
    return atributo ? atributo.value_name : 'Desconocido';
  }

  sortData(sort: Sort) {
    const data = this.autos.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }
  
    this.autos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'precio':
          return this.compare(a.price, b.price, isAsc);
        case 'kilometraje':
          return this.compare(this.getKilometraje(a), this.getKilometraje(b), isAsc);
        default:
          return 0;
      }
    });
  }
  
  compare(a: Number | Date | string, b: Number | Date | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  

}
