import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetPdfDataService {
  http = inject(HttpClient);

  constructor() { }

  fetchPdfData(sno: number, headOfAccId: number){
    return this.http.get(`http://192.168.1.18:9003/requestindent/generate/purchaseorder/${sno}?headOfAccId=${headOfAccId}`);
  }
}
