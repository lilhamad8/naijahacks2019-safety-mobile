import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

export const dbTables = {
  REPORTS: "reports",
  USER: "user",
  CONTACTS: "contacts",
  FINGERPRINT_FOR_LOGIN: "fingerprint_for_login",
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }


  keys: string[] = ['user', 'reports'];

  clear(): void {
    this.storage.clear();
    window.localStorage.clear();
    console.log('cleared ')
  }


  clearKey(key: string): boolean {
    // this.storage.remove(key);
    localStorage.setItem(key, '');
    console.log('key to be cleared '+ key);
    return true;
  }


  get(key: string) {
    return localStorage.getItem(key);
  // async get(key: string): Promise<string> {
  //   let result;
  //   try {
  //     result = await this.storage.get(key);
  //   } catch (e) {
  //     throw e;
  //   }
  //   return result;
  }

  set(key: string, value: any): boolean {
    // this.storage.set(key, value).then((onloadeddata) => {
    //   return true;
    // }, () => {
    // }).catch((error) => {
    //   //log
    //   return false;
    // });
    localStorage.setItem(key, value);
    return false;
  }



}

