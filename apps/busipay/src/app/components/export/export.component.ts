import { Component, OnInit, Input } from '@angular/core';
import * as Papa from 'papaparse';

@Component({
  selector: 'busipay-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
  @Input() toExport: any[];

  constructor() {}

  ngOnInit() {}

  click() {
    const result = Papa.unparse(
      this.toExport
        .filter(item => item.pay)
        .map(item => ({ Balance: item.balance, IBAN: item.iban })),
      { headers: true }
    );
    console.log(result);
    const csvData = new Blob([result], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, 'download.csv');
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'download.csv');
    tempLink.click();
  }
}
