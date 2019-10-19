import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'busipay-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  selectedItem: string;
  data = [
    {
      img: 'assets/inv.jpg',
      pay: true,
      balance: 4520,
      iban: 'CY17 0020 0128 0000 0012 0052 7600',
      boxes: [
        { top: 265, left: 630, width: 195, height: 50, label: 'Balance Due' }
      ]
    },
    {
      img: 'assets/img.png',
      pay: true,
      balance: 154.06,
      iban: 'CY17 0020 0128 0000 0012 0052 7601',
      boxes: [
        { top: 540, left: 605, width: 100, height: 50, label: 'Balance Due' }
      ]
    }
  ];
  constructor() {}

  ngOnInit() {
    this.selectedItem = this.data[0].img;
  }

  click(item) {
    this.selectedItem = item.img;
  }
}
