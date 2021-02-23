import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private analyticsService: AnalyticsService
  ) {
    this.analyticsService.initAdobeLaunchDataLayer();
    this.analyticsService.injectAdobeLaunchScript();
  }

  ngOnInit() {
    //TODO: add dataLayer push
  }

  title = 'my-app';

  public pushEvent(eventCode: string, eventLabel: string) {
    (window as any).adobeDataLayer.push({
      'event': eventCode, // e.g. buttonClick, linkClick
      'eventLabel': eventLabel
    });

    console.info((window as any).adobeDataLayer.getState())
  }
}
