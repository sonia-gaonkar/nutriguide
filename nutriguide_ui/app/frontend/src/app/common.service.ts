import { Injectable } from '@angular/core';
import { AppConstants } from './app.constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  serverurl: any;

  constructor( private http: HttpClient) { }

  getServerURL() {

    let hname = `${window.location.protocol}//${window.location.host}`;    
    this.serverurl = `${hname}${AppConstants.serverAPI}`;
    return this.serverurl;

  }

  async getUserbyId(id: any){
		let userData: any = await this.http.get(`${this.serverurl}data/users/${id}`, {}).toPromise();
    return userData.users[0];

  }

}
