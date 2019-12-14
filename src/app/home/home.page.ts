import { Component } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Autostart } from '@ionic-native/autostart/ngx';
import { ReportService } from '../report.service';
import { GeneralService } from '../general.service';
import { File } from '@ionic-native/file/ngx';
import { UserService } from '../user.service';
const MEDIA_FOLDER_NAME = 'crime_media';
import * as moment from 'moment'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  storageDirectory: any;
  files:any;
  public user: object;
  public fullname: string;
  public contacts: any;
  constructor(private autostart: Autostart, 
    private backgroundMode: BackgroundMode, 
    private mediaCapture: MediaCapture, 
    private toast: ToastController, 
    private socialSharing: SocialSharing,
    private platform: Platform, 
    private reportService: ReportService,
    private deviceMotion: DeviceMotion,
    public userService: UserService,
    public generalService: GeneralService,
    private file: File) {
      this.platform.ready().then(()=>{
        let path = this.file.dataDirectory;
        this.user = userService.getUser();
        this.user = userService.getContacts();
        this.contacts = userService.getContacts();
        console.log('contacts '+ this.contacts);
        console.log('contacts '+ this.contacts.length);
        if(this.user){
          console.log('haq ' + this.user["user"][0]["fields"])
          this.fullname = this.user["user"][0]["fields"]["first_name"] + ' '+ this.user[0]["fields"]["last_name"];
        }else{
          this.fullname = "Guest";
        }
        
        if (this.platform.is('cordova')) {

          if(this.generalService.returnShake()){
            this.generalService.showToast(2000, 'O ti shake o');
          }
          this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
            () => {
              this.loadFiles();
            },
            err => {
              this.file.createDir(path, MEDIA_FOLDER_NAME, false);
            }
            );
          }
          
          console.log('user- '+JSON.stringify(this.user));
          // console.log('time '+moment().format("HH:mm"));
        });
        
      }
      
      
      captureImage() {
        this.mediaCapture.captureImage().then(
          (data: MediaFile[]) => {
            if (data.length > 0) {
              // this.copyFileToLocalDir(data[0].fullPath);
              console.log('file '+data[0].fullPath);
              // this.sendFileToApi(data[0].fullPath, 'Robbery');
              this.sendShare(data[0].fullPath);
            }
          },
          (err: CaptureError) => console.error(err)
          );
        }
        
        recordAudio() {
          this.mediaCapture.captureAudio().then(
            (data: MediaFile[]) => {
              if (data.length > 0) {
                this.copyFileToLocalDir(data[0].fullPath);
                console.log('file '+data[0].fullPath);
                this.sendShare(data[0].fullPath);
              }
            },
            (err: CaptureError) => console.error(err)
            );
          }
          
          recordVideo() {
            this.mediaCapture.captureVideo().then(
              (data: MediaFile[]) => {
                if (data.length > 0) {
                  this.copyFileToLocalDir(data[0].fullPath);
                  this.sendShare(data[0].fullPath);
                  console.log('file '+data[0].fullPath);
                }
              },
              (err: CaptureError) => console.error(err)
              );
            }
            
            sendFileToApi(data, type){
              console.log('time '+moment().toDate().getTime());
              console.log('time '+moment().format('DD/MM/YYYY'));
              let report:object = {};
              let file:object = {};
              report["sender"] = this.user["id"]; report["time"] = moment().format("HH:mm"); 
              report['date'] = moment().format('DD/MM/YYYY');
              report['location'] = //;
              report['type'] = type;
              // file['body'] = 
              // this.reportService.sendReportToApi(file);
            }
            
            copyFileToLocalDir(fullPath) {
              let myPath = fullPath;
              // Make sure we copy from the right location
              if (fullPath.indexOf('file://') < 0) {
              myPath = 'file://' + fullPath;
            }
            
            const ext = myPath.split('.').pop();
            const d = Date.now();
            const newName = `${d}.${ext}`;
            
            const name = myPath.substr(myPath.lastIndexOf('/') + 1);
            const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
            const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
            
            this.file.copyFile(copyFrom, name, copyTo, newName).then(
              success => {
                this.loadFiles();
              },
              error => {
                console.log('error: ', error);
              }
              );
            }
            
            loadFiles() {
              this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
                res => {
                  this.files = res;
                },
                err => console.log('error loading files: ', err)
                );
              }
              
              sendShare(file) {
                if(this.contacts && this.contacts.length > 0){
                  this.socialSharing.shareViaEmail('Hey they I was attached find the location and file on your email', 'Hi, I`m in trouble!! Help', ['lilhamad8@gmail.com, adewaleadedirana@gmail.com'], null, null, Image=file).then(() => {
                    // Success!
                  }).catch(() => {
                    // Error!
                  });
                }
                this.socialSharing.share('Hi,\n\nHey they I was attached find the location and file on your email.\n', '\nFiles here.', file, '\nhttp://facebook.com');
              }
            }
