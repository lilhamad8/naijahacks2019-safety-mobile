import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from './user.service';
import { Autostart } from '@ionic-native/autostart/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Add Contact',
      url: '/list',
      icon: 'person-add'
    },
    {
      title: 'Analyse Video',
      url: '/analyse',
      icon: 'play'
    }
  ];
  private user:any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    public userService: UserService,
    private autostart: Autostart,
    private router: Router,
    private backgroundMode: BackgroundMode,
    ) {
      this.initializeApp();
      this.user = userService.getUser();
    }
    
    initializeApp() {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.autostart.enable();
        this.backgroundMode.enable();
        if(this.user){
          this.navCtrl.navigateRoot('/home');
        }else{
          this.navCtrl.navigateRoot('/login');
        }
        
        this.platform.backButton.subscribe(async () => {
          if (this.router.isActive('/home', true) || this.router.isActive('/login', true)) {
            navigator['app'].exitApp();
          }
        });
      });
    }
    
    //color #0A1D7F
  }
