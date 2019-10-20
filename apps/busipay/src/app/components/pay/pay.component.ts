import { Component, OnInit, Input } from '@angular/core';
import { BocService } from '../../api/boc.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as AWS from 'aws-sdk';
import * as _ from 'lodash';

@Component({
  selector: 'busipay-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  bucketName = 'busipay';
  bucketRegion = 'eu-west-1';
  IdentityPoolId = 'eu-west-1:ef71e09a-28e0-40fd-91a7-a3479c4ec1da';
  s3;
  @Input() toPay: any[];
  @Input() rawData;
  availableBalance;
  constructor(private boc: BocService, private spinner: NgxSpinnerService) {
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

  ngOnInit() {
    this.boc.availableBalanceChanged.subscribe(() => {
      this.boc.getAvailableBalance().subscribe(
        ({ balance }: any) => {
          this.availableBalance = balance;
        },
        () => {
          this.availableBalance = null;
        }
      );
    });
  }

  click() {
    this.spinner.show('pay');
    this.boc
      .pay(
        this.toPay
          .filter(item => {
            if (item.selected) item.pay = true;
            return item.selected;
          })
          .map(item => ({ amount: item.balance, iban: item.iban }))
      )
      .subscribe(() => {
        this.spinner.hide('pay');
        this.boc.availableBalanceChanged.next();
        console.log(this.rawData);
        Object.keys(this.rawData).forEach(key => {
          const invoiceCont = this.rawData[key];
          const invoices = invoiceCont.invoices;
          _.each(invoices, invoice => {
            this.s3.upload(
              {
                Bucket: this.bucketName,
                Key: invoice.jsonKey,
                Body: JSON.stringify(invoice.json)
              },
              (err, data) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Updated:', invoice.jsonKey);
                }
              }
            );
          });
        });
      });
  }
}
