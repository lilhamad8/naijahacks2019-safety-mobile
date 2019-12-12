import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})



export class GeneralService {
  public loading : any;
  constructor(private loadingController: LoadingController,private toast: ToastController,) { }
  
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
  
  
  
}
