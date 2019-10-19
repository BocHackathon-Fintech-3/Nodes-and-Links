import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'busipay-image-subset',
  templateUrl: './image-subset.component.html',
  styleUrls: ['./image-subset.component.scss']
})
export class ImageSubsetComponent implements OnInit {
  @Input() src: string;
  @Input() boxes: {
    top: number;
    left: number;
    width: number;
    height: number;
    label: string;
  }[];
  newBoxes: {
    top: string;
    left: string;
    width: string;
    height: string;
    label: string;
  }[];
  imgWidth;
  imgHeight;
  private readonly desiredWidth = 982;

  constructor() {}

  ngOnInit() {
    const newImg = new Image();

    newImg.onload = () => {
      const height = newImg.height;
      console.log('height', height);
      const width = newImg.width;
      console.log('width', width);
      console.log('this.boxes', this.boxes);
      const ratio = this.desiredWidth / width;
      // const ratio = 1;
      console.log('ratio', ratio);
      this.imgHeight = `${ratio * height}px`;
      console.log('this.imgHeight', this.imgHeight);

      this.imgWidth = `${ratio * width}px`;
      console.log('this.imgWidth', this.imgWidth);
      this.newBoxes = this.boxes.map(box => ({
        top: `${ratio * box.top}px`,
        left: `${ratio * box.left}px`,
        width: `${ratio * box.width}px`,
        height: `${ratio * box.height}px`,
        label: box.label
      }));
      console.log('this.newBoxes', this.newBoxes);
    };

    newImg.src = this.src;
  }
}
