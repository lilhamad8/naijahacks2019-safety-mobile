import { Injectable } from '@angular/core';
import { StorageService, dbTables } from './storage.service';
import { ApiService } from './api.service';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private storage: StorageService, private api: ApiService) {
    
  }
  
  // pens
  async setReport(reports) {
    this.getReports();
    await this.storage.set(dbTables.REPORTS, JSON.stringify(reports));
  }
  
  
  getReports() {
    let reports = this.storage.get(dbTables.REPORTS);
    return JSON.parse(reports);
  }

  async sendReportToApi(reportData):Promise<boolean> {
    return new Promise((resolve,reject) => {
      this.api.sendPost('login',reportData).subscribe(async response => {
        // await this.setUser(response.data);
        resolve(response);
      }, async (err) => {
        reject(err);
      });
    });
  }
}
