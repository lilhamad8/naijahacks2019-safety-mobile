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
  public error: boolean;
  public error_message: string;
  public bordercolor: string = 'rgba(25, 25, 25, 0.32)';
  passwordType: string = 'password';
  passwordIcon: string = 'eye';
  public email: string;
  public password: string;
  message: string;
  status: boolean;
  constructor(private menu: MenuController,
    private api: ApiService,
    public router: Router,
    public navCtrl: NavController,
    public reportService: ReportService,
    public userService: UserService,
    private generalService: GeneralService,
    public events: Events) {
      this.menu.enable(false);
      this.loginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
    };
    
    noError() {
      this.error = false;
      this.bordercolor = 'rgba(25, 25, 25, 0.32)';
    }
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
    hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
  }
