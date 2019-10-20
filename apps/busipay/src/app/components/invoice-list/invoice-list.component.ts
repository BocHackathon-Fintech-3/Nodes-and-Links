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
      const regex1 = RegExp(
        '[A-Z]{2}[0-9]{2}(?:[ ]?[A-Z0-9]{4}){4}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?'
      );
      const regex2 = /^(?:(?:IT|SM)\d{2}[A-Z]\d{22}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/i;
      this.invoiceService.getAll(uploadTimestamp).then(rawData => {
        rawData = rawData[uploadTimestamp].invoices;
        this.data = _.map(rawData, (rawDataVal, rawDataKey) => {
          let ibanValue;
          const ibanBlock = rawDataVal.json.Blocks.find(block => {
            const hasIban1 = block.Text && regex1.test(block.Text);
            const hasIban2 = block.Text && regex2.test(block.Text);
            if (hasIban1) ibanValue = regex1.exec(block.Text)[0];
            if (hasIban2) ibanValue = regex2.exec(block.Text)[0];
            return hasIban1 || hasIban2;
          });
          const pairs = computePairs(rawDataVal.json);
          console.log('pairs', pairs);
          let totalKey;
          let totalBlockWithValue;
          let totalLabel;
          _.each(pairs, (blockWithValue, key) => {
            const possibilities = [
              'Sum',
              'TOTAL:',
              'TOTAL',
              'Invoice Total',
              'Total (GBP)',
              'BALANCE DUE',
              'Total amount due',
              'AMOUNT DUE',
              'Balance Due:',
              'Balance (USD)',
              'Invoice Amount:'
            ];
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
          const balance = isFinite(parseInt(totalBlockWithValue.val[0]))
            ? parseFloat(totalBlockWithValue.val)
            : parseFloat(totalBlockWithValue.val.slice(1));
          const boxes = [
            {
              top: boundingBox.Top,
              left: boundingBox.Left,
              width: boundingBox.Width,
              height: boundingBox.Height,
              label: totalLabel
            }
          ];
          const toReturn: any = {
            title: rawDataKey,
            img: rawDataVal.img_url,
            pay: false,
            balance,
            boxes
          };
          if (ibanBlock) {
            console.log('found iban');
            toReturn.iban = ibanValue;
            const ibanBoundingBox = ibanBlock.Geometry.BoundingBox;
            boxes.push({
              top: ibanBoundingBox.Top,
              left: ibanBoundingBox.Left,
              width: ibanBoundingBox.Width,
              height: ibanBoundingBox.Height,
              label: 'IBAN'
            });
          }
          return toReturn;
        });
        this.selectedItem = this.data[0].title;
      });
    });
  }

  click(item) {
    this.selectedItem = item.title;
  }
}
