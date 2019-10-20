import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../api/invoice.service';
import * as _ from 'lodash';

@Component({
  selector: 'busipay-my-invoices',
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.scss']
})
export class MyInvoicesComponent implements OnInit {
  invoices = {};
  noInvoices = true;
  loading = true;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.invoiceService.getAll().then(invoices => {
      console.log(invoices);
      this.invoices = invoices;
      this.loading = false;
      this.noInvoices = _.isEmpty(this.invoices);
    });
  }

  downloadAll() {}
}
