import { Injectable, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

declare const window: Window;
declare const _satellite: any;

@Injectable({
  providedIn: 'root',
})
export class ScriptInjectorService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone
  ) {}

  load(id: string, src: string) {
    const scriptElement: HTMLScriptElement = this.document.createElement(
      'script'
    );
    scriptElement.id = id;
    scriptElement.src = src;
    scriptElement.async = false;

    const promise = new Promise<void>((resolve, reject) => {
      scriptElement.addEventListener('load', () => {
        setTimeout(resolve, 10);
      });
      scriptElement.addEventListener('error', (err) => {
        reject(err);
      });
    });

    this.zone.runOutsideAngular(() => {
      this.document.head.appendChild(scriptElement);
    });

    return promise;
  }
}

@Injectable({
    providedIn: 'root',
  })
export class AnalyticsService {
    constructor(private scriptInjectorService: ScriptInjectorService) {}
  
    initAdobeLaunchDataLayer() {
        (window as any).adobeDataLayer = [];        
    }
  
    async injectAdobeLaunchScript() {
      try {
        await this.scriptInjectorService.load(
          'launch',
          environment.ADOBE_LAUNCH_SCRIPT_URL
        );
        _satellite.pageBottom();
      } catch (e) {
        console.error('Error while loading Adobe Launch script', e);
      }
    }
}