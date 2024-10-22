import { Component, TemplateRef, OnInit, ViewEncapsulation, Inject, Injectable  } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import { CommonService } from './../common.service';
import { AppConstants } from './../app.constants';

@Component({
  selector: 'app-healthy-swaps',
  templateUrl: './healthy-swaps.component.html',
  styleUrl: './healthy-swaps.component.css'
})
export class HealthySwapsComponent {

  serverurl: any;
  showspinner: boolean = false;
  token: any;
  userData: any;
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

    //post body
    let formDataTemp: any = {};
		let watsonapi = 'analysis';
		formDataTemp.watsonServerURL = `${AppConstants.watsonServerURL}${watsonapi}`;

		formDataTemp.action = action;
		formDataTemp.food_item = this.chatquery;

    formDataTemp.entries = [{
      "personal_information": this.userData
    }];


		//const headers = { 'Authorization': this.storage.retrieve('token').token };
    const headers = { 'Authorization': "#test" };
		var res = await this.http.post(`${this.serverurl}data/analysis`, formDataTemp, { headers }).toPromise();

    if(res) {
      this.showspinner = false;
      let watsonxpredictions = (<any>res).watsonxdata.predictions[0];
      this.chatResponse = watsonxpredictions;
    }

  }

  clearText(name: any){
    (<HTMLInputElement>document.getElementById(name)).value = '';
  }

}
