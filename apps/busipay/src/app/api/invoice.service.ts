import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  bucketName = 'busipay';
  bucketRegion = 'eu-west-1';
  IdentityPoolId = 'eu-west-1:ef71e09a-28e0-40fd-91a7-a3479c4ec1da';
  s3;

  constructor(private http: HttpClient) {
    AWS.config.update({
      region: this.bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.IdentityPoolId
      })
    });
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName }
    });
  }

  public async getAll(uploadTimestamp?) {
    const invoices = {};
    console.log('S3 get all', uploadTimestamp);
    const params = {
      Bucket: this.bucketName,
      Prefix: !!uploadTimestamp ? '${uploadTimestamp}/' : ''
    };
    const data = await this.s3.listObjects(params).promise();
    console.log(data.Contents);
    return Promise.all(
      _.map(data.Contents, val => {
        console.log(val.Key);

        const batchKey = val.Key.split('/').shift();
        const filename = val.Key.split('/').pop();
        const invoiceName = filename.substring(0, filename.lastIndexOf('.'));
        if (!invoices[batchKey]) {
          invoices[batchKey] = {};
        }
        if (!invoices[batchKey][invoiceName]) {
          invoices[batchKey][invoiceName] = {};
        }
        const fileType = val.Key.substr(val.Key.lastIndexOf('.') + 1);
        if (fileType !== 'json') {
          invoices[batchKey][invoiceName].img_url =
            'https://busipay.s3-eu-west-1.amazonaws.com/' + val.Key;
          return new Promise(resIn => resIn());
        } else {
          return new Promise(resIn => {
            this.s3.getObject(
              { Bucket: this.bucketName, Key: val.Key },
              (err, jdata) => {
                invoices[batchKey][invoiceName].json = JSON.parse(jdata.Body);
                resIn();
              }
            );
          });
        }
      })
    ).then(() => invoices);
  }
}
