import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import *  as AppConfig from '../../app/serverCalls';
import { Observable } from 'rxjs';

@Injectable()
export class MapsServiceProvider {
  cfg: any;
  constructor(public http: HttpClient) {
    this.cfg = AppConfig.cfg;
  }

  postUserDetails(mapsObj): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.cfg.mapsapi, mapsObj, httpOptions)
  }

  getUserDetails(): Observable<any> {
    let userObj={
      action:"list_devices"
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.cfg.mapsapi, userObj, httpOptions)
  }

}
