import { Component, OnInit, ViewChild } from '@angular/core';

import { RegistryService } from '../../../../services/registry.service';
import { EditorModelService } from '../../../../services/editor-model.service';
import { OverlayComponent } from '../../../shared/overlay/overlay.component';

@Component({
  selector: 'editor-misc-overlay',
  templateUrl: './editor-misc-overlay.component.html',
  styleUrls: ['./editor-misc-overlay.component.css']
})
export class EditorMiscOverlayComponent implements OnInit {

  @ViewChild('overlay') overlay : OverlayComponent;

  dragOver: boolean = false;

  constructor(
    private model: EditorModelService,
    private registry: RegistryService,
  ) { }

  ngOnInit() {
  }

  public activate() {
    this.overlay.activate();
  }

  public export() {
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.model.json, null, 2));
    let anchor = document.createElement('a');
    let model = this.model.json;

    anchor.setAttribute('href', data);
    anchor.setAttribute('download', 'node-' + model.path.replace(/\//g, '-') + '.json');

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  public import(event) {
    this.dragOver = false;

    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.model.load(this.model.id, JSON.parse(event.target.result), this.registry);
        this.overlay.close();
      }

      reader.readAsText(event.target.files[0]);
    }
  }
}
