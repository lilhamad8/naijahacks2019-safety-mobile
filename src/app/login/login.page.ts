import { Component } from '@angular/core';
import { Events, MenuController, NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { ApiService } from '../api.service';
import { GeneralService } from '../general.service';

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
  public fields = ['phone_no', 'password'];
  public status = [false, false];
  public message = ['', ''];
  constructor(private menu: MenuController,
    private api: ApiService,
    public router: Router,
    public navCtrl: NavController,
    public reportService: ReportService,
    private generalService: GeneralService,
    public events: Events) {
      this.menu.enable(false);
      this.loginForm = new FormGroup({
        phone_no: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
    };
    
    noError() {
      this.error = false;
      this.bordercolor = 'rgba(25, 25, 25, 0.32)';
    }
    async login() {
      this.error = false;
      let data = null;
      if (this.loginForm.valid) {
        this.generalService.showLoading(20000,"Loading...");
        this.api.sendPost('auth/login', this.loginForm.value).subscribe(async response => {
          
          localStorage.setItem('farm_user', JSON.stringify(response.data));
          localStorage.setItem('userToken', response.data.token.access_token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('first_use', '1');
          
          if(Object.keys(response.data.user.farms).length > 0 )
          {
            // fetch pens, sales and expense record and store them in local storage
            await this.penService.getPensFromApi(response.data.user.farms[0].id);
            await this.saleService.getSalesFromApi(response.data.user.farms[0].id);
            await this.expenseService.getExpensesFromApi(response.data.user.farms[0].id);
            
            // fetch pens, sales and expense record from backend
            await this.penService.getPenTypesFromApi();
            await this.saleService.getSalesTypesFromApi();
            await this.expenseService.getExpensesTypesFromApi();
            await this.trendService.getTrendsTypesFromApi();
            
            // make the click count 0 when it reach 20 it syncs
            await this.penService.setPensCLickCount(0);
            await this.saleService.setSalesCLickCount(0);
            await this.expenseService.setExpensesCLickCount(0);
            
            await localStorage.setItem('farm', JSON.stringify(response.data.user.farms[0]));
          }
          this.generalService.showLoading(20000,"Loading...");
          setTimeout(() => {
            this.progress.moveToNextPage(response.data.user.progress);
          }, 20000);
          this.generalService.stopLoading();
        }, async err => {
          this.generalService.stopLoading();
          if (typeof err.error.message == 'string') {
            this.bordercolor = '#B00020';
            this.error = true;
            this.error_message = err.error.message;
          }
          let response = this.errorHandler.errorChecker(err, this.fields, this.message, this.status);
        });
      } else {
        this.bordercolor = '#B00020';
        this.error = true;
        this.error_message = 'Please fill the phone number and password appropriately.'
      }
    }
    hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
  }
