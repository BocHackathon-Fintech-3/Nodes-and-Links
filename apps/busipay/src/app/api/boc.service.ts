import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BocService {
  public availableBalanceChanged: BehaviorSubject<void> = new BehaviorSubject(
    null
  );
  private url = 'https://8wwvj9ysma.execute-api.eu-west-1.amazonaws.com/prod/';
  constructor(private http: HttpClient) {}

  public getLoginUrl() {
    return this.http.get(`${this.url}login-url`);
  }

  public patchSubscription(code: string) {
    return this.http.get(`${this.url}patch-subscription?code=${code}`);
  }

  public getAvailableBalance() {
    return this.http.get(`${this.url}available-balance`);
  }

  public pay(payments) {
    return this.http.post(`${this.url}payments`, payments);
  }

  public checkSubscription() {
    return this.http.get(`${this.url}check-subscription`);
  }

  public logout() {
    return this.http.get(`${this.url}logout`);
  }
}
