import { Component, OnInit } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry
} from 'ngx-file-drop';

@Component({
  selector: 'busipay-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.scss']
})
export class DndComponent implements OnInit {
  constructor() {}

  public files: NgxFileDropEntry[] = [];

  ngOnInit() {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (
            file.type === 'application/pdf' ||
            file.type === 'image/png' ||
            file.type === 'image/jpeg'
          ) {
            // Here you can access the real file
            console.log('File allowed');
            console.log(droppedFile.relativePath, file);

            /**
            // You could upload it like this:
            const formData = new FormData()
            formData.append('logo', file, relativePath)
  
            // Headers
            const headers = new HttpHeaders({
              'security-token': 'mytoken'
            })
  
            this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
            .subscribe(data => {
              // Sanitized logo returned from backend
            })
          **/
          } else {
            // File type is not allowed
            console.log('File allowed');
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
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
