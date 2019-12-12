import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map, timeout } from 'rxjs/operators';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Events } from '@ionic/angular';
import { GeneralService } from './general.service';

const user =  JSON.parse(localStorage.getItem('farm_user'));
let httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'})
};

//staging
//Live
const url ='http://localhost:8o00/';
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
        private network: Network,
        private toastController: ToastController,
        public event: Events
        ) {
            
        }
        
        
        initializeNetworkEvents(): void {
            this.network.onDisconnect().subscribe(() => {
                if(this.previousStatus == ConnectionStatusEnum.ONLINE){
                    this.event.publish('network:offline');
                }
                this.previousStatus = ConnectionStatusEnum.OFFLINE;
            });
            this.network.onConnect().subscribe(() => {
                if(this.previousStatus == ConnectionStatusEnum.OFFLINE){
                    this.event.publish('network:online');
                }
                this.previousStatus = ConnectionStatusEnum.ONLINE;
            });
        }
        
        subscribeToNetworkEvents(){
            this.event.subscribe('network:offline', () => {
                //this.storageProvider.set(StorageParameters.NETWORK_STATUS, "false");
            });
            this.event.subscribe('network:online', () => {
                //this.storageProvider.set(StorageParameters.NETWORK_STATUS, "true")
            });
            
            this.initializeNetworkEvents();
        }
        
        isDeviceConnected() : boolean{
            //return Boolean(this.storageProvider.get(StorageParameters.NETWORK_STATUS));
            let conntype = this.network.type;
            return conntype && conntype !== 'unknown' && conntype !== 'none';
        }
        async networkHandler(){
            if (this.network.type === 'none') {
                console.log('network was disconnected :-(');
                // setTimeout(() => {
                //     navigator['app'].exitApp();
                // }, 4000);
            }
            console.log('lets see if network dey');
            let disconnectSubscription = this.network.onDisconnect().subscribe(async () => {
                console.log('network was disconnected :-(');
                const toast = await this.toastController.create({
                    message: "Please get a internet connection.",
                    duration: 3000
                });
                toast.present();
            });
            disconnectSubscription.unsubscribe();
            return;
        }
        
        httpOptions (useToken: boolean, data?:any) {
            this.networkHandler();
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
            // this.generalService.showLoading();
            const url = `${apiUrl}/${endpoint}`;
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
    
