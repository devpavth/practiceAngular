import { HttpParams, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Vendor } from '../../Models/Vendor/vendor.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  productHttp = inject(HttpClient);

  fetchLiveVendorDetails(params: {[key: string]: string}): Observable<Vendor[]>{
    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });

    console.log("httpParams:", httpParams.toString());

    return this.productHttp.get<Vendor[]>('http://localhost:9010/vendor/getactivevendors', {params: httpParams});
  }
}
