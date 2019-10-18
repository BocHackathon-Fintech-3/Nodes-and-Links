import { Component, OnInit } from '@angular/core';
import { BocService } from '../../api/boc.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'busipay-boc-login',
  templateUrl: './boc-login.component.html',
  styleUrls: ['./boc-login.component.scss']
})
export class BocLoginComponent implements OnInit {
  loginUrl: string;

  constructor(private boc: BocService, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((data: any) => {
      if (data instanceof NavigationStart) {
        if (data.url.startsWith('/boc-callback')) {
          const code = data.url.slice(data.url.indexOf('code=') + 5);
          this.boc.patchSubscription(code).subscribe(({ message }: any) => {
            window.close();
          });
        } else {
          this.boc.getLoginUrl().subscribe(({ loginUrl }: any) => {
            this.loginUrl = loginUrl;
          });
        }
      }
    });
  }
}
