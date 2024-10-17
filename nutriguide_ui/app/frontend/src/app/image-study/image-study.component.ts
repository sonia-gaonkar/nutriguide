import { Component, TemplateRef, OnInit, ViewEncapsulation, Inject, Injectable  } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import { CommonService } from './../common.service';
import { AppConstants } from './../app.constants';

@Component({
  selector: 'app-image-study',
  templateUrl: './image-study.component.html',
  styleUrl: './image-study.component.css'
})
export class ImageStudyComponent {
  
  serverurl: any;
  showspinner: boolean = false;
  token: any;
  userData: any;
  showImgLink: boolean = false;
  imgThumbnail: String = '';
  showImgLink1: boolean = false;
  chatResponse: any;
  chatquery: any;

  constructor( private router: Router, private http: HttpClient, 
    @Inject(SESSION_STORAGE) private storage: StorageService,
		private location: Location,
    private CommonService: CommonService
	) {}

  async ngOnInit() {	

    this.serverurl = this.CommonService.getServerURL();
    this.token = this.storage.get('TOKEN');
    this.userData = await this.CommonService.getUserbyId(this.token.id)
    
    delete this.userData["username"];
    delete this.userData["_id"];
    delete this.userData["password"];
    delete this.userData["email"];

  }


  async getChatResponse(form: NgForm, action: any) { 

    this.chatResponse = "";
    this.chatquery = form.value.chatQuery;
    this.showspinner = true;
    console.log('................................----------',  form.value)


    //post body
    let formDataTemp: any = {};
		let watsonapi = 'analysis';
		formDataTemp.watsonServerURL = `${AppConstants.watsonServerURL}${watsonapi}`;

		formDataTemp.action = action;
		formDataTemp.query = this.chatquery;

    if(form.value.imageLink) {
      formDataTemp.action = 'IMAGE_ANALYSIS';
      formDataTemp.image_url = form.value.imageLink 
    }

    formDataTemp.entries = [{
      "personal_information": this.userData
    }];

    //formDataTemp.entries = [this.userData];	

		//const headers = { 'Authorization': this.storage.retrieve('token').token };
    const headers = { 'Authorization': "#test" };
		var res = await this.http.post(`${this.serverurl}data/analysis`, formDataTemp, { headers }).toPromise();

    if(res) {
      this.showspinner = false;
      let watsonxpredictions = (<any>res).watsonxdata.predictions[0];
      this.chatResponse = watsonxpredictions.food_items;

      console.log('..................this.chatResponse.^^^^^^^.............----------',  this.chatResponse)

      //this.chatResponse = this.chatResponse.replace(/(?:\r\n|\r|\n)/g, '<br>');
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

}
