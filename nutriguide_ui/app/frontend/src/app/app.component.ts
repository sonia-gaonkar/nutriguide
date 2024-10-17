import { Component, TemplateRef, OnInit, Inject, Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Location } from '@angular/common';
import AOS from "aos";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { LocalStorageService, LocalStorage} from 'ngx-webstorage';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppConstants } from './app.constants';
import { CommonService } from './common.service';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nutriguide';
  modalRef: any =  BsModalRef;
  transyHeader: boolean = true;
  isHomeActive: boolean = true;
  serverurl: any;
  isSessionActive : any;
  isDashboardActive: boolean = false;
  token: any;
  userData: any;

  constructor(public modalService: BsModalService, 
    private location: Location,
    private router: Router, 
    private http: HttpClient, 
    private CommonService: CommonService,
    @Inject(SESSION_STORAGE) private storage: StorageService
    //private storage : LocalStorageService,
  ) {}

  async ngOnInit() {

    this.isSessionActive = this.storage.get('isSessionActive')

 
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      mirror: false
    });
    this.loadScript("assets/js/main.js");

    this.serverurl = this.CommonService.getServerURL();

    if(!this.isSessionActive) {
      console.log('session expired');
      this.storage.clear();
      this.router.navigate(['./']);
    }


    if(this.location.path()) {

      this.transyHeader = false;
      this.isHomeActive = false;
      if (_.some(['dashboard'], (el) => _.includes(this.location.path(), el))) this.isDashboardActive = true;
    
    }else {
      this.isHomeActive = true;
      this.isDashboardActive = false;    
    }


    this.token = this.storage.get('TOKEN');
    console.log('.........token..................',  this.token)

    this.userData = await this.CommonService.getUserbyId(this.token.id)

    console.log('........ this.userData..xxxxxx.ccccccccccccccc.....',  this.userData)
    

  }

  async openLoginModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-md',
        //initialState : JSON.stringify(xldata)
    });
  }

  login(form: NgForm) {

    let headers = new HttpHeaders({});
    this.http.post(`${this.serverurl}auth/signin`, {
      username: form.value.username,
      //password: form.value.password
      //password: bcrypt.hashSync(form.value.password, 8)
      password: btoa(form.value.password)
    
    }).subscribe(data => {

        // handle the data
        //this.storage.store('isSessionActive', true);
        //this.storage.store('token', data);
        this.storage.set('isSessionActive', true);
        this.storage.set('TOKEN', data);
        window.location.href="dashboard"
      },
      error => {
        console.log(error)
        //this.failedlogin = true;
      }); 
	}

  public loadScript(url: any) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  logout() {
		this.http.post(`${this.serverurl}auth/signout`, {})
			.subscribe(data => {
				this.storage.clear();
				this.router.navigate(['./']);
      },
      error => {});
	}


  async openProfileModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg',
        //initialState : JSON.stringify(xldata)
    });
  }

}
