import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextractService {
  private url = 'https://lf2xtnrgmj.execute-api.eu-west-1.amazonaws.com/prod/';
  constructor(private http: HttpClient) {}

  public process(uploadTimestamp, S3Object) {
    console.log('Textractor lambda trigger');
    return this.http.post(`${this.url}textract`, { uploadTimestamp, S3Object });
  }
}
