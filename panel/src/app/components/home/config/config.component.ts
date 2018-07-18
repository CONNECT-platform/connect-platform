import { Component, OnInit, ViewChild } from '@angular/core';

import { BackendService } from '../../../services/backend.service';


@Component({
  selector: 'home-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  @ViewChild('successOverlay') successOverlay;
  @ViewChild('errorOverlay') errorOverlay;

  options: any = {
    showGutter: false,
    maxLines: Infinity,
    tabSize: 2,
  }

  _configCode = "{\n}";
  error : any;

  constructor(private backend: BackendService) {}

  ngOnInit() {
    this.backend.fetchConfig().subscribe(response => {
      this._configCode = JSON.stringify(response.config, null, 2);
    });
  }

  get configCode() {
    return this._configCode;
  }

  set configCode(code: string) {
    this._configCode = code || "{\n}";
  }

  save() {
    try {
      this.backend.updateConfig(JSON.parse(this._configCode)).subscribe(response => {
        if (response == 'done')
          this.successOverlay.activate();
      });
    }
    catch(error) {
      this.error = error;
      this.errorOverlay.activate();
    }
  }
}
