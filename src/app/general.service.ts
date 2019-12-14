import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';


@Injectable({
  providedIn: 'root'
})



export class GeneralService {
  public loading : any;
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;
  isShake:boolean;
  constructor(private loadingController: LoadingController,private toast: ToastController,private deviceMotion: DeviceMotion,) { }
  
  async showLoading(duration?:number, message?:string){
    this.loading = await this.loadingController.create({
      spinner: 'lines-small',
      duration: duration?duration:4000,
      message: message?message:"Loading...",
      translucent: true,
    });
    this.loading.present();
  }
  async showToast(duration?:number, message?:string){
    const toast = await this.toast.create({
      message: message,
      duration: duration? duration:3000
    });
    toast.present();
  }
  
  stopLoading(){
    this.loading.dismiss();
  }
  
  returnShake():boolean{
    var subscription = this.deviceMotion.watchAcceleration({frequency:200}).subscribe(acc => {
      //console.log(acc);
      
      if(!this.lastX) {
        this.lastX = acc.x;
        this.lastY = acc.y;
        this.lastZ = acc.z;
        return;
      }
      
      let deltaX:number, deltaY:number, deltaZ:number;
      deltaX = Math.abs(acc.x-this.lastX);
      deltaY = Math.abs(acc.y-this.lastY);
      deltaZ = Math.abs(acc.z-this.lastZ);
      
      if(deltaX + deltaY + deltaZ > 3) {
        this.moveCounter++;
      } else {
        this.moveCounter = Math.max(0, --this.moveCounter);
      }
      
      this.lastX = acc.x;
      this.lastY = acc.y;
      this.lastZ = acc.z;
      
      if(this.moveCounter > 8) { 
        console.log('SHAKE');
        this.isShake = true;
        // this.loadCats(); 
        this.moveCounter=0; 
      }
    });
    return this.isShake;
  }
  
  
}
