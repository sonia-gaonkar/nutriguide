import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CommonService } from './../common.service';
import { AppConstants } from './../app.constants';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  modalRef: any = BsModalRef;
  featureData: any;
  serverurl: any;
  validPswd: boolean = true;
  validEmail: boolean = true;
  emailExists: boolean = false;
  usersData: any;
  usernameExists: any = false;


  constructor( 
		public modalService: BsModalService,
    private router: Router, private http: HttpClient, 
		private location: Location,
    private CommonService: CommonService
	) {}

	async ngOnInit() {
    this.serverurl = this.CommonService.getServerURL();
    this.modalService.onHide.subscribe((e) => {
		});
  }

  async openSignUpModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, {
        class: 'modal-xl',
      });
  }

  async openFeatureUpModal(template: TemplateRef<any>, feature: any) {

    //let summary = _.find(AppConstants.FeaturesData, feature);
    this.featureData = _.find(AppConstants.FeaturesData, { feature : feature });

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }


  async saveUser(form: NgForm) {

    console.log('................................----------',  form.value)
    let formIsValid = true;
    let newformData = form.value

    this.checkPassword(null, form.value.password);
    const password = form.value.password;
    form.value.password = bcrypt.hashSync(password, 8);
 
    let medical_condition: any = {};
    _.each(form.value, ( val, key ) => { 
      if(key.includes("medicond_")) {
        if(val== true) {
          let splt = key.split("medicond_")
          medical_condition[splt[1]] = val;          
        }
        delete newformData[key]
      }
    });

    newformData.medical_condition = medical_condition;

     
    if(form.status == "INVALID") formIsValid = false;
    else if(!this.validPswd){
      formIsValid = false;
    } 
    else if(!this.validEmail){
      formIsValid = false;
    } 
    else if(this.emailExists){
      formIsValid = false;
    } 

    if(formIsValid==true) {

      this.http.post(`${this.serverurl}data/users`, newformData)
        .subscribe(data => {
        // handle the data
           //this.onSubmitSuccess = true;
        form.reset();

        setTimeout(() => {
          //this.onSubmitSuccess = false;
        }, 2000);

      },
      error => { 
        //this.tileMsgFailure = true;
      });
    }

  }



  checkPassword($event: any, val: any) {
    let str;
    str = $event!=null ? $event.target.value : val;
    let re = /^(?=.*\d)(?=.*[!_@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    this.validPswd = re.test(str);
    return re.test(str);
  }

  validateEmail($event: any, email: any) {
    let str;
    str = $event!=null ? $event.target.value : email;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.validEmail = re.test(str);
    return re.test(str);
  }

  async emailCheck($event: any, email: any) {
    let str;
    str = $event!=null ? $event.target.value : email;

    
    let data: any = await this.getAllUsers();
		this.usersData = data;

    if(data) {
      console.log('...........this.usersData......................', this.usersData)

      let foundUser: any = {};
      foundUser = _.find(this.usersData.users, { 'email': str});

      console.log('........foundUser.............', foundUser)
      if(foundUser) this.emailExists = true;
      else this.emailExists = false;
    }
  }

  async usernameCheck($event: any, username: any) {
    let str;
    str = $event!=null ? $event.target.value : username;

    let data: any = await this.getAllUsers();
		this.usersData = data;

    let foundUser: any = {};
    foundUser = _.find(this.usersData.users, { 'username': str});
    if(foundUser) this.usernameExists = true;
    else this.usernameExists = false;
  } 


  async getAllUsers() {

    let data: any = await this.http.get(`${this.serverurl}data/users`, {}).toPromise();
		return  data;	

  }


}
