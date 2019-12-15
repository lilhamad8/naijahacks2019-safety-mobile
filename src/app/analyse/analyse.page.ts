import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../general.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.page.html',
  styleUrls: ['./analyse.page.scss'],
})
export class AnalysePage implements OnInit {
  public url:string;
  constructor(public generalService: GeneralService, public menuCtrl: MenuController) {
    this.menuCtrl.enable(true);
   }

  ngOnInit() {
  }

  runml(){
    if(this.url.length>1){
      this.generalService.showLoading();
      setTimeout(() => {
        this.generalService.stopLoading();
      }, 3000);
      this.generalService.showToast(2000, 'endpoint incomplete');
    }
   
  }

}
