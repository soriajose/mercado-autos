import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://api.mercadolibre.com/sites/MLA/search?category=MLA1743';

  constructor(private http: HttpClient) {}

  getAutos(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}&q=${query}`);
  }
}
