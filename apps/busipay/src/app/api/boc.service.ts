import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BocService {
  private url = 'https://8wwvj9ysma.execute-api.eu-west-1.amazonaws.com/prod/';
  constructor(private http: HttpClient) {}

  public getLoginUrl() {
    return this.http.get(`${this.url}login-url`);
  }

  public patchSubscription(code: string) {
    return this.http.get(`${this.url}patch-subscription?code=${code}`);
  }
}
