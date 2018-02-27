import { Component, OnInit } from '@angular/core';
import { EditorModelService } from '../../../services/editor-model.service';


@Component({
  selector: 'editor-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  constructor(private model: EditorModelService) { }

  ngOnInit() {
  }

  nextMethod() {
    if (this.model.method == 'GET') return 'POST';
    if (this.model.method == 'POST') return 'PUT';
    if (this.model.method == 'PUT') return 'DELETE';
    if (this.model.method == 'DELETE') return 'GET';
    return 'GET';
  }
}
