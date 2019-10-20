import { Component, OnInit, Input } from '@angular/core';
import { InvoiceService } from '../../api/invoice.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { ZipService } from '../../api/zip.service';

@Component({
  selector: 'busipay-zip-invoices-download',
  templateUrl: './zip-invoices-download.component.html',
  styleUrls: ['./zip-invoices-download.component.scss']
})
export class ZipInvoicesDownloadComponent implements OnInit {
  loading = false;
  @Input() uploadTimestamp: string;
  @Input() @Input() toExport: any;

  constructor(private zipService: ZipService) {}

  download = () => {
    // console.log(this.invoices);
    this.loading = true;
    this.zipService
      .generateZip(this.uploadTimestamp, this.toExport)
      .then(data => {
        saveAs(
          data,
          `${moment().format('YYYY-MM-DD HHmm')}-busipay-export.zip`
        );
        this.loading = false;
      });
  };

  ngOnInit() {}
}
