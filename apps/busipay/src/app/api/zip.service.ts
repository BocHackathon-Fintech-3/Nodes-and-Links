import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class ZipService {
  constructor() {}

  public generateZip(uploadTimestamp, toExport): Promise<Blob> {
    return new Promise<Blob>(resolve => {
      console.log(uploadTimestamp);
      let datatoExport = {};

      if (uploadTimestamp) {
        datatoExport[uploadTimestamp] = toExport[uploadTimestamp];
      } else {
        datatoExport = toExport;
      }

      console.log(toExport);

      const zip = new JSZip();

      return Promise.all(
        _.flatten(
          _.map(datatoExport, (upload, key) => {
            console.log(upload);
            const uploadFolder = zip.folder(key);
            const invoicesImgFolder = uploadFolder.folder('Invoices');
            const invoices = upload.invoices;

            const csvtoExport = Papa.unparse(
              _.map(invoices, invoice => ({
                Filename: invoice.filename,
                Balance: invoice.json.busipay.balance,
                IBAN: invoice.json.busipay.iban
              })),
              { headers: true }
            );
            console.log(csvtoExport);
            const csvData = new Blob([csvtoExport], {
              type: 'text/csv;charset=utf-8;'
            });

            uploadFolder.file('index.csv', csvData);

            return Object.keys(invoices).map(async invoiceName => {
              if (!invoices[invoiceName].img_url) {
                return new Promise(resIn => resIn());
              } else {
                // console.log(invoices[invoiceName].img_url);
                // console.log(invoices[invoiceName].filename);
                // loading a file and add it in a zip file
                return new Promise(resIn => {
                  JSZipUtils.getBinaryContent(
                    invoices[invoiceName].img_url,
                    async (err, data) => {
                      if (err) {
                        throw err; // or handle the error
                      }
                      await invoicesImgFolder.file(
                        invoices[invoiceName].filename,
                        data,
                        {
                          binary: true
                        }
                      );
                      resIn();
                    }
                  );
                });
              }
            });
          })
        )
      ).then(() => {
        zip.generateAsync({ type: 'blob' }).then(content => {
          resolve(content);
        });
      });
    });
  }
}
