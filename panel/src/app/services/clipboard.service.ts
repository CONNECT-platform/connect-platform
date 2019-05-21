import { Injectable } from '@angular/core';

@Injectable()
export class ClipboardService {

  constructor() { }

  public copy(text: string, event: any) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    let _ = document.createElement('textarea');
    _.style.position = 'fixed'; _.style.left = '0'; _.style.top = '0'; _.style.opacity = '0';
    _.value = text;
    document.body.appendChild(_);
    _.focus(); _.select();
    document.execCommand('copy');
    document.body.removeChild(_);
  }
}
