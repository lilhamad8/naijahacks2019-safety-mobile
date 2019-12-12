import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

export const dbTables = {
  PENS: "pens",
  PEN_TYPES: "pen_types",
  PEN_TYPES_LIST: "pen_types_list",
  SALES: "sales",
  EXPENSES: "expenses",
  CURRENT_TREND: "current_trend",
  TREND_DURATIONS_LIST: "current_trend",
  SALES_TYPES: "sales_types",
  EXPENSES_TYPES: "expenses_types",
  TRENDS_TYPES: "trends_types",
  FARM: "farm",
  PENS_CLICK_COUNT: "pens_click_count",
  SALES_CLICK_COUNT: "sales_click_count",
  EXPENSES_CLICK_COUNT: "expenses_click_count",
  PENS_CHANGES_COUNT: "pens_changes_count",
  SALES_CHANGES_COUNT: "sales_changes_count",
  EXPENSES_CHANGES_COUNT: "expenses_changescount",
  DAILY_RECORD_STATUS: "daily_record_status",
  FARM_USER: "farm_user",
  USER: "user",
  USER_TOKEN: "user_token",
  FIRST_USE: "first_use",
  SYNC_RECORD: "sync_records",
  DELETED_RECORDS: "deleted_records",
  DELETED_EXPENSES_RECORDS: "deleted_expenses_records",
  DELETED_SALES_RECORDS: "deleted_sales_records",
  FINGERPRINT_FOR_LOGIN: "fingerprint_for_login",
};

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }


  keys: string[] = ['pens', 'pen_types', 'farm', 'farm_user', 'user', 'user_token', 'first_use', 'UserPprogress', 'fingerprint_for_login'];

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

