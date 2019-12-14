import { Injectable } from '@angular/core';
import { StorageService, dbTables } from './storage.service';
import { ApiService } from './api.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: any;
  constructor(private storage: StorageService, private api: ApiService) {
    
  }
  
  // pens
  async setUser(user) {
    await this.storage.set(dbTables.USER, JSON.stringify(user));
  }
  
  
  getContacts() {
    let contacts = this.storage.get(dbTables.CONTACTS);
    return JSON.parse(contacts);
  }
  // contacts
  async setContacts(contact) {
    console.log(contact);
    let old_contacts = this.getContacts()? this.getContacts(): [];
    console.log(old_contacts);
    old_contacts.push(contact);
    console.log(old_contacts);
    await this.storage.set(dbTables.CONTACTS, JSON.stringify(old_contacts));
  }
  
  
  getUser() {
    let user = this.storage.get(dbTables.USER);
    return JSON.parse(user);
  }
  
  // getUserFromApi(loginData) {
  //   console.log('in the service ');
  //   this.api.sendPost('login',loginData).subscribe(async response => {
  //     await this.setUser(response.data);
  //     // this.user = response.data;
  //     return response.data
  //   }, async err => {
  //     return err
  //   });
  
  // }
  
  async getUserFromApi(loginData):Promise<boolean> {
    // my real promise b**ch
    return new Promise((resolve,reject) => {
      this.api.sendPost('login',loginData).subscribe(async response => {
        await this.setUser(response.data);
        resolve(response);
      }, async (err) => {
        reject(err);
      });
    });
  }
}