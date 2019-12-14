import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
declare var google: any;
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
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  public text:string;
  private moveCounter:number = 0;
  @ViewChild('Map', {static: false}) mapElement: ElementRef;
  map: any;
  mapOptions: any;
  location = {lat: null, lng: null};
  markerOptions: any = {position: null, map: null, title: null};
  marker: any;
  apiKey: any = 'AIzaSyBEB-2qDJdNaOGjDI5Fr-snSQ7dNdsMWao'; /*Your API Key*/
  constructor(private autostart: Autostart, 
    private backgroundMode: BackgroundMode, 
    private mediaCapture: MediaCapture, 
    private toast: ToastController, 
    private socialSharing: SocialSharing,
    private platform: Platform, 
    private reportService: ReportService,
    private deviceMotion: DeviceMotion,
    private locationAccuracy: LocationAccuracy,
    public userService: UserService,
    public generalService: GeneralService,
    public geolocation: Geolocation,
    private file: File) {
      this.platform.ready().then(()=>{
        // map
        const script = document.createElement('script');
        script.id = 'googleMap';  
        if (this.apiKey) {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey;
        } else {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=';
        }
        document.head.appendChild(script);
        /*Get Current location*/
        this.geolocation.getCurrentPosition().then((position) =>  {
          this.location.lat = position.coords.latitude;
          this.location.lng = position.coords.longitude;
        });
        /*Map options*/
        this.mapOptions = {
          center: this.location,
          zoom: 21,
          mapTypeControl: false
        };
        setTimeout(() => {
          this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
          /*Marker Options*/
          this.markerOptions.position = this.location;
          this.markerOptions.map = this.map;
          this.markerOptions.title = 'My Location';
          this.marker = new google.maps.Marker(this.markerOptions);
        }, 3000);
        
        
        //location acuracy
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          
          if(canRequest) {
            // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => console.log('Request successful'),
              error => console.log('Error requesting location permissions', error)
              );
            }
            
          });
          let path = this.file.dataDirectory;
          this.user = userService.getUser();
          this.contacts = userService.getContacts();
          
          this.backgroundMode.enable();
          this.backgroundMode.on("activate").subscribe(()=>{
            // this.generalService.showToast(1000,'background ');
            var subscription = deviceMotion.watchAcceleration({frequency:200}).subscribe(acc => {
              //console.log(acc);
              
              this.calcAcceleration(acc);
              
            });
          });
          
          if(this.user){
            this.fullname = this.user["user"]["first_name"];
          }else{
            this.fullname = "Guest";
          }
          
          if (this.platform.is('cordova')) {
            this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
              () => {
                this.loadFiles();
              },
              err => {
                this.file.createDir(path, MEDIA_FOLDER_NAME, false);
              }
              );
            }
            // console.log('time '+moment().format("HH:mm"));
          });
          
        }
        
        
        captureImage() {
          this.mediaCapture.captureImage({limit: 1}).then(
            (data: MediaFile[]) => {
              if (data.length > 0) {
                data[0].name = 'Danger Report Image '+moment().toDate().getTime()+' '+moment().format('DD/MM/YYYY');
                this.sendShare(data[0].fullPath);
              }
            },
            (err: CaptureError) => console.error(err)
            );
          }
          
          recordAudio() {
            this.mediaCapture.captureAudio({limit: 1, duration: 60}).then(
              (data: MediaFile[]) => {
                if (data.length > 0) {
                  data[0].name = 'Danger Report Audio '+moment().toDate().getTime()+' '+moment().format('DD/MM/YYYY');
                  // this.copyFileToLocalDir(data[0].fullPath);
                  this.sendShare(data[0].fullPath);
                }
              },
              (err: CaptureError) => console.error(err)
              );
            }
            
            recordVideo() {
              this.mediaCapture.captureVideo({limit: 1, duration: 10, quality: 20}).then(
                (data: MediaFile[]) => {
                  if (data.length > 0) {
                    data[0].name = 'Danger Report Video '+moment().toDate().getTime()+' '+moment().format('DD/MM/YYYY');
                    // this.copyFileToLocalDir(data[0].fullPath);
                    this.sendShare(data[0].fullPath);
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
                  let msg = "Hello, this is "+ this.fullname+",\nI am being harassed at ikeja. \nYou can find the footage of the event here below.\nFind help!!!"
                  if(this.contacts && this.contacts.length > 0){
                    this.socialSharing.shareViaEmail(msg, "An emergency message from " + this.fullname, this.contacts, null, null, Image=file).then(() => {
                      // Success!
                    }).catch(() => {
                      // Error!
                    });
                  }else{
                    this.socialSharing.shareViaEmail(msg, "An emergency message from " + this.fullname, this.contacts, null, null, Image=file);
                  }
                }
                
                sendText() {
                  
                  if(this.contacts && this.contacts.length > 0){
                    this.socialSharing.shareViaEmail(this.text, this.contacts, null).then(() => {
                      // Success!
                    }).catch(() => {
                      // Error!
                    });
                  }else{
                    this.socialSharing.share(this.text, null, null);
                  }
                }
                
                
                
                calcAcceleration(acc){
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
                  
                  if(this.moveCounter > 10) { 
                    console.log('SHAKE');
                    // this.generalService.showToast(1000, `Shake o o o o`);
                    // this.openCamera();
                    this.recordVideo();
                    this.moveCounter=0; 
                  }
                  
                  this.lastX = acc.x;
                  this.lastY = acc.y;
                  this.lastZ = acc.z;
                }
              }
