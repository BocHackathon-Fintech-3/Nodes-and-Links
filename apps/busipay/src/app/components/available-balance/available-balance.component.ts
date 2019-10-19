import { Component, OnInit } from '@angular/core';
import { BocService } from '../../api/boc.service';

@Component({
  selector: 'busipay-available-balance',
  templateUrl: './available-balance.component.html',
  styleUrls: ['./available-balance.component.scss']
})
export class AvailableBalanceComponent implements OnInit {
  availableBalance;
  constructor(private boc: BocService) {}

  ngOnInit() {
    this.boc.availableBalanceChanged.subscribe(() => {
      this.boc.getAvailableBalance().subscribe(({ balance }: any) => {
        this.availableBalance = balance;
      });
    });
  }
}
