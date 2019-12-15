import { Component } from '@angular/core';
import { Events, MenuController, NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { ApiService } from '../api.service';
import { GeneralService } from '../general.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  public email: string = "admin@admin.com";
  public password: string = "admin@1234";
  message: string;
  status: boolean;
  constructor(private menu: MenuController,
    private api: ApiService,
    public router: Router,
    public navCtrl: NavController,
    public userService: UserService,
    private generalService: GeneralService,
    ) {
    };
    
    async login() {
      if (this.email!=null && this.password!=null) {
        this.generalService.showLoading(1000,"Login in...");
        await this.userService.getUserFromApi({"username":this.email, "password":this.password})
        .then(async res => {
          this.navCtrl.navigateRoot('/home');
        })
        .catch(async error => {
          this.status = true;
          this.message = error.error.error;
        });
      } else {
        this.status = true;
        this.message = 'Please fill the phone number and password appropriately.'
      }
    }
  }
