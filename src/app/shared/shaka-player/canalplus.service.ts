import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CanalPlusService {
  constructor(private http: HttpClient) { }

  getCanalPlusF1Data(): Observable<any> {
    const url = 'https://forja.me/canalplus/api/824';
    return this.http.get(url);
  }
}
