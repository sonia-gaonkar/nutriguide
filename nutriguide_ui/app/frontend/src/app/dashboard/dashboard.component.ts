import { Component, TemplateRef, OnInit, ViewEncapsulation, Inject, Injectable  } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

import { CommonService } from './../common.service';
import { AppConstants } from './../app.constants';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  serverurl: any;
  showScanner: boolean = false;   
  modalRef: any = BsModalRef;
  analysisData: any;
  analysisTitle: String = '';
  analysisAction: String = '';
  token: any
  userDataa: any

  constructor(private router: Router, private http: HttpClient, 
    @Inject(SESSION_STORAGE) private storage: StorageService,
		private location: Location,
    public modalService: BsModalService,
    private CommonService: CommonService) {}

  async ngOnInit() {
    this.serverurl = this.CommonService.getServerURL();

    this.token = this.storage.get('TOKEN');
    console.log('.........token..................',  this.token)

    this.userDataa = await this.CommonService.getUserbyId(this.token.id)

    //console.log('........ this.userData..xxxxxx......',  this.userDataa)

    delete this.userDataa["username"];
    delete this.userDataa["_id"];
    delete this.userDataa["password"];
    delete this.userDataa["email"];
    

    //this.loadScript("assets/js/slider.js");
  }

  async getAnalysis(template: TemplateRef<any>, action: any) {
    this.showScanner = true;
    this.analysisData = '';
    this.analysisTitle = '';
    this.analysisAction = '';

    //post body
    let formDataTemp: any = {};
		let watsonapi = 'analysis';
		formDataTemp.watsonServerURL = `${AppConstants.watsonServerURL}${watsonapi}`;

		formDataTemp.api_key = AppConstants.apiKey;
		formDataTemp.project_id = AppConstants.rfpProjecId
		formDataTemp.model_id =  AppConstants.rfpModelID;
		formDataTemp.url = AppConstants.rfpurl		
		formDataTemp.prompt = AppConstants.analysisPrompt;		
		formDataTemp.decoding_method = AppConstants.decodingMethod;
		formDataTemp.embedding_model = AppConstants.embeddingModel;
		formDataTemp.temperature = AppConstants.temperature;
		formDataTemp.action = action;
		//formDataTemp.query = userText;
		formDataTemp.max_tokens = AppConstants.maxTokens;
		formDataTemp.min_tokens = AppConstants.minTokens;
		formDataTemp.file_path = '';

    formDataTemp.entries = [{
      "personal_information": {
            "name": "Emily Johnson",
            "age": 28,
            "height_cm": 165,
            "weight_kg": 72,
            "BMI": 26.4,
            "menstrual_cycle_regular": "False",
            "PCOD_diagnosis_year": 2018
        }
    }];	

		//const headers = { 'Authorization': this.storage.retrieve('token').token };
    const headers = { 'Authorization': "#test" };
		var res = await this.http.post(`${this.serverurl}data/analysis`, formDataTemp, { headers }).toPromise();

    if(res) {
      this.showScanner = false;

      let watsonxpredictions = (<any>res).watsonxdata.predictions[0];

      if(action == 'NUTRITIONAL_MYTHS_FACTS') {
        this.analysisTitle = 'Nutritional Myths & Facts';
        this.analysisAction = 'NUTRITIONAL_MYTHS_FACTS';
        let watsonx_resp = watsonxpredictions.myths;
        this.analysisData = watsonx_resp
  
      }else if(action == 'HYDRATION_TIPS') {
        this.analysisTitle = 'Hydration Tips';
        this.analysisAction = 'HYDRATION_TIPS';
        let watsonx_resp = watsonxpredictions;
        this.analysisData = watsonx_resp

      }else if(action == 'FOOD_GROUP_OVERVIEW') {
        this.analysisTitle = 'Nutritional Category';
        this.analysisAction = 'FOOD_GROUP_OVERVIEW';
        let watsonx_resp = watsonxpredictions.food_groups; 
        //let watsonx_resp = watsonxpredictions['Major Food Groups'];
        this.analysisData = watsonx_resp;

      }else if(action == 'WEEKLY_EXCERSIZE_PLAN') {
        this.analysisTitle = 'Weekly Exercise Plan';
        this.analysisAction = 'WEEKLY_EXCERSIZE_PLAN';
        let watsonx_resp = watsonxpredictions;
        this.analysisData = watsonx_resp

      }else if(action == 'WEEKLY_DIET_PLAN') {
        this.analysisTitle = 'Weekly Diet Plan';
        this.analysisAction = 'WEEKLY_DIET_PLAN';
        let watsonx_resp = watsonxpredictions;
        this.analysisData = watsonx_resp
      
      }else if(action == 'SEASONAL_FOOD_GUIDE') {
        this.analysisTitle = 'Seasonal Food Guide';
        this.analysisAction = 'SEASONAL_FOOD_GUIDE';
        let watsonx_resp = watsonxpredictions.seasonal_food_guide;
        this.analysisData = watsonx_resp

        console.log(',......analysisData analysisData analysisData..............', this.analysisData)
      }

      this.modalRef = this.modalService.show(template, {
        class: 'modal-xl',
      });
  
      //return watsonx_resp;
    }

  }

  public loadScript(url: any) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

}
