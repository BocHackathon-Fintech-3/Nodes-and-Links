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
    const uploadData = {};
    console.log('S3 get all', uploadTimestamp);
    const params = {
      Bucket: this.bucketName,
      Prefix: !!uploadTimestamp ? `${uploadTimestamp}/` : ''
    };
    const data = await this.s3.listObjects(params).promise();
    console.log(data.Contents);
    return Promise.all(
      _.map(data.Contents, val => {
        console.log(val.Key);

        const batchKey = val.Key.split('/').shift();
        const filename = val.Key.split('/').pop();
        const invoiceName = filename.substring(0, filename.lastIndexOf('.'));
        if (!uploadData[batchKey]) {
          uploadData[batchKey] = { count: 0, invoices: {} };
        }
        if (!uploadData[batchKey]['invoices'][invoiceName]) {
          uploadData[batchKey]['invoices'][invoiceName] = {
            img_url: '',
            filename: '',
            json: {}
          };
        }
        const fileType = val.Key.substr(val.Key.lastIndexOf('.') + 1);
        console.log(fileType);
        if (fileType === 'json') {
          return new Promise(resIn => {
            this.s3.getObject(
              { Bucket: this.bucketName, Key: val.Key },
              (err, jdata) => {
                uploadData[batchKey]['invoices'][invoiceName].json = JSON.parse(
                  jdata.Body
                );

                uploadData[batchKey]['invoices'][invoiceName].jsonKey = val.Key;
                uploadData[batchKey].count++;
                resIn();
              }
            );
          });
        }
        // if (['pdf', 'png', 'jpeg'].find(t => t === fileType)) {
        uploadData[batchKey]['invoices'][invoiceName].img_url =
          'https://busipay.s3-eu-west-1.amazonaws.com/' + val.Key;
        uploadData[batchKey]['invoices'][invoiceName].filename = filename;
        //   return new Promise(resIn => resIn());
        // }
      })
    ).then(() => uploadData);
  }
}
