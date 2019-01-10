import { Component, OnInit, ViewChild } from '@angular/core';

import { BackendService } from '../../../services/backend.service';

const _DefaultScript =
`const platform = require('connect-platform');

platform.configure({
  //
  // add your configuration here ...
  //
});
`;

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
  _prodConfCode = "{\n}";
  _confScriptCode = _DefaultScript;
  error : any;

  constructor(private backend: BackendService) {}

  ngOnInit() {
    this.backend.fetchConfig().subscribe(response => {
      this._configCode = JSON.stringify(response.config, null, 2);
    });

    this.backend.fetchProdConf().subscribe(response => {
      this._prodConfCode = JSON.stringify(response.config, null, 2);
    });

    this.backend.fetchConfScript().subscribe(response => {
      this._confScriptCode = response.script;
    });
  }

  get configCode() {
    return this._configCode;
  }

  set configCode(code: string) {
    this._configCode = code || "{\n}";
  }

  get prodConf() {
    return this._prodConfCode;
  }

  set prodConf(code: string) {
    this._prodConfCode = code || "{\n}";
  }

  get confScript(): string {
    return this._confScriptCode;
  }

  set confScript(code: string) {
    if (!code.trim().length)
      this._confScriptCode = _DefaultScript;
    else
      this._confScriptCode = code;
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

  saveProd() {
    try {
      this.backend.updateProdConf(JSON.parse(this._prodConfCode)).subscribe(response => {
        if (response == 'done')
          this.successOverlay.activate();
      });
    }
    catch(error) {
      this.error = error;
      this.errorOverlay.activate();
    }
  }

  saveScript() {
    try {
      this.backend.updateConfScript(this._confScriptCode).subscribe(response => {
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
