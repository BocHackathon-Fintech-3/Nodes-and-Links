import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../api/invoice.service';
import * as _ from 'lodash';
import { computePairs } from './helper';

@Component({
  selector: 'busipay-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  selectedItem: string;
  data = [
    //   {
    //   img: 'assets/inv.jpg',
    //   pay: true,
    //   balance: 4520,
    //   iban: 'CY17 0020 0128 0000 0012 0052 7600',
    //   boxes: [
    //     { top: 265, left: 630, width: 195, height: 50, label: 'Balance Due' }
    //   ]
    // },
    // {
    //   img: 'assets/img.png',
    //   pay: true,
    //   balance: 154.06,
    //   iban: 'CY17 0020 0128 0000 0012 0052 7601',
    //   boxes: [
    //     { top: 540, left: 605, width: 100, height: 50, label: 'Balance Due' }
    //   ]
    // }
  ];
  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const uploadTimestamp = params.get('uploadTimestamp');
      this.invoiceService.getAll(uploadTimestamp).then(rawData => {
        rawData = rawData[uploadTimestamp];
        this.data = _.map(rawData, (rawDataVal, rawDataKey) => {
          const pairs = computePairs(rawDataVal.json);
          console.log('pairs', pairs);
          let totalKey;
          let totalBlockWithValue;
          let totalLabel;
          _.each(pairs, (blockWithValue, key) => {
            const possibilities = ['TOTAL', 'Invoice Total'];
            const foundLabel = possibilities.find(
              pos => pos.toLowerCase() === key.toLowerCase()
            );
            if (foundLabel) {
              totalKey = key;
              totalBlockWithValue = blockWithValue;
              totalLabel = foundLabel;
            }
          });
          const block = totalBlockWithValue.block;
          const boundingBox = block.Geometry.BoundingBox;
          return {
            title: rawDataKey,
            img: rawDataVal.img_url,
            pay: true,
            balance: totalBlockWithValue.val,
            boxes: [
              {
                top: boundingBox.Top,
                left: boundingBox.Left,
                width: boundingBox.Width,
                height: boundingBox.Height,
                label: totalLabel
              }
            ]
          };
        });
        this.selectedItem = this.data[0].title;
      });
    });
  }

  click(item) {
    this.selectedItem = item.title;
  }
}
