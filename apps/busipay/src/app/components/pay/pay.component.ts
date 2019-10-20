import { Component, OnInit, Input } from '@angular/core';
import { BocService } from '../../api/boc.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'busipay-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  @Input() toPay: any[];
  availableBalance;
  constructor(private boc: BocService, private spinner: NgxSpinnerService) {}

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
          .filter(item => item.pay)
          .map(item => ({ amount: item.balance, iban: item.iban }))
      )
      .subscribe(() => {
        this.spinner.hide('pay');
        this.boc.availableBalanceChanged.next();
      });
  }
}
