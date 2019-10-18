import { Component, OnInit } from '@angular/core';
import { BocService } from '../../api/boc.service';

@Component({
  selector: 'busipay-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  availableBalance;
  constructor(private boc: BocService) {}

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
    this.boc
      .pay([
        { amount: 1, iban: 'CY17 0020 0128 0000 0012 0052 7600' },
        { amount: 2, iban: 'CY17 0020 0128 0000 0012 0052 7600' }
      ])
      .subscribe(() => {
        this.boc.availableBalanceChanged.next();
      });
  }
}
