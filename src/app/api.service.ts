import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map, timeout } from 'rxjs/operators';
import { ToastController, Events } from '@ionic/angular';
import { GeneralService } from './general.service';

const user =  JSON.parse(localStorage.getItem('farm_user'));
let httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'})
};

//staging
const url ='http://localhost:8000/';
//Live
// const url = 'http://212.71.237.113:8000/'

const apiUrl = url+'api/v1';
export const NewtworkErrorMessage = "Please connect to a network to continue";

export enum ConnectionStatusEnum{
    ONLINE,
    OFFLINE
}

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    public  url = url;
    networkStatus: boolean;
    previousStatus: ConnectionStatusEnum = ConnectionStatusEnum.ONLINE;
    
    constructor(private http: HttpClient,
        private generalService: GeneralService, 
        private toastController: ToastController,
        public event: Events
        ) {
            
        }
        
        httpOptions (useToken: boolean, data?:any) {
            // this.networkHandler();
            if (useToken ) {
                const user =  JSON.parse(localStorage.getItem('farm_user'));
                const   token  = user.token.access_token;
                return {
                    headers: new HttpHeaders({
                        'Accept':'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Authorization': `Bearer ${token}`
                    }),
                    body: data? data :null
                };
            }
            return {
                headers: new HttpHeaders({
                    'Accept':'application/json',
                    'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'
                })
            };
        }
        
        
        private handleError(error: HttpErrorResponse) {
            
            let errorMsg = null;
            if (error.error instanceof ErrorEvent) {
                errorMsg =  error.error.message;
            } else {
                if (error.status === 422) {
                    errorMsg = error.error.errors;
                }
            }
            return errorMsg;
        }
        private extractData(res: Response) {
            const body = res;
            return body || { };
        }
        
        sendGet(endpoint, useToken?: boolean): Observable<any> {
            // this.generalService.showLoading();
            // this.networkHandler();
            const url = `${apiUrl}/${endpoint}`;
            return this.http.get(url, this.httpOptions(useToken)).pipe(timeout(1000*60))            
        }
        
        sendPost(endpoint, data, useToken?: boolean): Observable<any> {
          console.log('in sendpost ');
          console.log('in data '+JSON.stringify(data));
          console.log('in tok '+useToken);
            // this.generalService.showLoading();
            const url = `${apiUrl}/${endpoint}`;
            console.log('in url '+url);
            return this.http.post(url, data, this.httpOptions(useToken)).pipe(timeout(1000*60));
        }
        
        sendDelete(endpoint, data, useToken?: boolean): Observable<any> {
            // this.generalService.showLoading();
            console.log('data ');
            console.log('data '+this.httpOptions(useToken,data));
            const url = `${apiUrl}/${endpoint}`;
            return this.http.delete(url,  this.httpOptions(useToken,data)).pipe(timeout(1000*60));
        }
        
        sendPut(endpoint: string, data, useToken?: boolean): Observable<any> {
            // this.networkHandler();
            const url = `${apiUrl}/${endpoint}`;
            return this.http.put(url, data, this.httpOptions(useToken)).pipe(timeout(1000*60));
        }
        
        // sendDelete(endpoint: string, useToken?: boolean): Observable<any> {
        //     // this.networkHandler();
        //     const url = `${apiUrl}/${endpoint}`;
        //     return this.http.delete(url, this.httpOptions(useToken))
        //         .pipe(
        //             catchError(this.handleError)
        //         );
        // }
        
        sendRecordToServer()
        {
            
        }
    }
    
