import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Contact } from './app.component';

@Injectable()
export class ContactsService {

  private apiURL = 'http://ferantoapitest.azurewebsites.net';

  constructor(private http: Http) {}

  getContacts(): Promise< Contact[] > {
    const _headers = new Headers();
    _headers.append('Content-Type', 'application/json');
    _headers.append('ZUMO-API-VERSION', '2.0.0');

    return this.http.get(this.apiURL + '/contacts', {headers : _headers})
                    .toPromise()
                    .then(response => response.json() as Contact[])
                    .catch(this.handleError);
  }



  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }


}
