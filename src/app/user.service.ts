import { Injectable } from '@angular/core';
import { StorageService, dbTables } from './storage.service';
import { ApiService } from './api.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public pens: any;
  constructor(private storage: StorageService, private api: ApiService) {
    
  }
  
  // pens
  async setPens(pens) {
    let refined_pens = pens ? JSON.stringify(pens) : '';
    let a :any=[];
    a.push(refined_pens);
    await this.storage.set(dbTables.PENS, a);
  }
  
  getPens(id?:any) {
    let pens = this.storage.get(dbTables.PENS);
    // pens make sense now when loged it can be turned to local variable
    return pens ?  JSON.parse(pens) : id ? JSON.parse(this.getPensFromApi(id)): pens;
  }
  
  getPensCount(id?:any) {
    return this.getPens().length;
  }
  
  getPensFromApi(farmId) {
    this.api.sendGet('farms/' + farmId + '/batches?include=records', true).subscribe(async response => {
      await this.setPens(response.data);
      this.pens = response.data;
    }, async err => {
    });
    return this.pens;
  }
  