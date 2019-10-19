import { Component, OnInit } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry
} from 'ngx-file-drop';
import * as AWS from 'aws-sdk';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextractService } from '../../api/textract.service';
import { Router } from '@angular/router';
import { InvoiceService } from '../../api/invoice.service';

@Component({
  selector: 'busipay-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.scss']
})
export class DndComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  bucketName = 'busipay';
  bucketRegion = 'eu-west-1';
  IdentityPoolId = 'eu-west-1:ef71e09a-28e0-40fd-91a7-a3479c4ec1da';
  s3;
  uploadTimestamp: number;

  constructor(
    private _router: Router,
    private _snackBar: MatSnackBar,
    private textractService: TextractService,
    private invoiceService: InvoiceService
  ) {
    AWS.config.update({
      region: this.bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.IdentityPoolId
      })
    });
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName }
    });
  }

  ngOnInit() {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    this.uploadTimestamp = Date.now();
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          //Todo: Perform File Size Check First
          if (
            ['application/pdf', 'image/png', 'image/jpeg'].find(
              t => t === file.type
            )
          ) {
            // Here you can access the real file
            console.log('File allowed');
            console.log(droppedFile.relativePath, file);
            this.uploadToS3(file);
          } else {
            // File type is not allowed
            console.log('File is not allowed');
            console.log(droppedFile.relativePath, file);
            return;
          }
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log('Files Directory');
        console.log(droppedFile.relativePath, fileEntry);
      }
    }

    // this.invoiceService.getAll(this.uploadTimestamp);
    // this.invoiceService.getAll().then(invoices => {
    //   console.log(invoices);
    // });
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  public uploadToS3(file) {
    const fileUploadPromise = this.s3
      .upload({
        Key: this.uploadTimestamp + '/' + file.name,
        Bucket: this.bucketName,
        Body: file,
        ACL: 'private'
      })
      .promise();

    fileUploadPromise
      .then(data => {
        console.log(data);
        this.textractService.process(this.uploadTimestamp, data).subscribe();
        this._snackBar.open('Invoice(s) successfully uploaded.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: 'snack-bar-success'
        });

        // this._router.navigate(['/review']);
      })
      .catch((error: any) => {
        this._snackBar.open('Something went wrong.', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: 'snack-bar-failure'
        });
      });
  }
}
