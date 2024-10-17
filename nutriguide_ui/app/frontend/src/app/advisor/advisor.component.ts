
import { Component, TemplateRef, OnInit, ViewEncapsulation, Inject, Injectable  } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
//import { LocalStorageService, LocalStorage} from 'ngx-webstorage';

import { CommonService } from './../common.service';
import { AppConstants } from './../app.constants';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrl: './advisor.component.css'
})
export class AdvisorComponent {

  serverurl: any;
  chatResponse: any;
  chatquery: any;
  showspinner: boolean = false;
  showImgLink: boolean = false;
  showImgLink1: boolean = false;
  imgThumbnail: String = '';
  token: any
  userData: any

  constructor( private router: Router, private http: HttpClient, 
		//private storage: LocalStorageService, 
    @Inject(SESSION_STORAGE) private storage: StorageService,
		private location: Location,
    private CommonService: CommonService
	) {}

  async ngOnInit() {	
    this.serverurl = this.CommonService.getServerURL();

    this.token = this.storage.get('TOKEN');
    console.log('.........token..................',  this.token)

    this.userData = await this.CommonService.getUserbyId(this.token.id)

    console.log('........ this.userData..xxxxxx......',  this.userData)

    delete this.userData["username"];
    delete this.userData["_id"];
    delete this.userData["password"];
    delete this.userData["email"];

    console.log('........ this.userData..1111111111111111111111111......',  this.userData)

  }

  async submitChat(form: NgForm) {
    this.chatResponse = "";
    this.chatquery = form.value.chatQuery;
    this.showspinner = true;

    /* this.http.post(`${this.serverurl}data/chatQuery`, form.value)
      .subscribe(data => {
        this.showspinner = false;
        let resp = (data as any).response;
        this.chatResponse = resp.replace('\n\n', ' <br><br> ');
        window.scrollTo(0, 0);
        setTimeout(() => {
        }, 5000);      
    });  */

  }



  async getChatResponse(form: NgForm, action: any) {

    this.chatResponse = "";
    this.chatquery = form.value.chatQuery;
    this.showspinner = true;
    console.log('................................----------',  form.value)


    //post body
    let formDataTemp: any = {};
		let watsonapi = 'chat';
		formDataTemp.watsonServerURL = `${AppConstants.watsonServerURL}${watsonapi}`;

		formDataTemp.action = action;
		formDataTemp.query = this.chatquery;

    if(form.value.imageLink) {
      //this.imgThumbnail
      formDataTemp.action = 'USER_IMAGE_QUERY';
      formDataTemp.image_url = form.value.imageLink 
    }


/*     formDataTemp.entries = [{
      "personal_information": {
            "name": "Emily Johnson",
            "age": 28,
            "height_cm": 165,
            "weight_kg": 72,
            "BMI": 26.4,
            "menstrual_cycle_regular": "False",
            "PCOD_diagnosis_year": 2018
        }
    }];	 */
    //formDataTemp.entries = [this.userData];	
    formDataTemp.entries = [{
      "personal_information": this.userData
    }];

		//const headers = { 'Authorization': this.storage.retrieve('token').token };
    const headers = { 'Authorization': "#test" };
		var res = await this.http.post(`${this.serverurl}data/analysis`, formDataTemp, { headers }).toPromise();

    if(res) {
      this.showspinner = false;
      let watsonxpredictions = (<any>res).watsonxdata.predictions[0];
      this.chatResponse = watsonxpredictions.response;
      //this.chatResponse = this.chatResponse.replace('\n', ' \r<br> ');
      this.chatResponse = this.chatResponse.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }

  }


  showImageLink(status: any){
    this.showImgLink = status;
  }

  setImageThumbnail() { 
    this.imgThumbnail = '';
    this.showImgLink = true;
    this.imgThumbnail = (<HTMLInputElement>document.getElementById("imageLink")).value;
    this.imgThumbnail = this.imgThumbnail.trim();
    if(this.imgThumbnail) this.showImgLink1 = true;
  }

  clearText(name: any){
    (<HTMLInputElement>document.getElementById(name)).value = '';
    this.showImgLink1 = false;
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 10)+"px";
  }

}
