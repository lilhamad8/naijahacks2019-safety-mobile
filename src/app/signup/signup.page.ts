import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from '../user.service';
import { GeneralService } from '../general.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public first_name: string;
  public email: string;
  public phone: string;
  public password: string;
  message: string;
  status: boolean;
  constructor(    private api: ApiService,
    public router: Router,
    public navCtrl: NavController,
    public userService: UserService,
    private generalService: GeneralService,) { }

  ngOnInit() {
  }

  async signup() {
    if (this.email!=null && this.password!=null) {
      this.generalService.showLoading(1000,"Login in...");
      await this.userService.createUserFromApi({"first_name":this.first_name,"last_name":this.first_name, "email":this.email, "phone":this.phone, "password":this.password})
      .then(async res => {
        this.navCtrl.navigateRoot('/home');
      })
      .catch(async error => {
        this.status = true;
        this.message = error.error.email? error.error.email:'';
        this.message += error.error.phone? 'Enter a valid phone number.':'';
      });
    } else {
      this.status = true;
      this.message = 'Please fill the form properly.'
    }
  }

}
