import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'busipay-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'busipay';
  constructor(private router: Router) {}
  click() {
    this.router.navigate(['/']);
  }
}
