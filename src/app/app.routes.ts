import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },  // Ruta predeterminada
    { path: '**', redirectTo: '' }  // Redirige cualquier ruta desconocida a la página de inicio
  ];