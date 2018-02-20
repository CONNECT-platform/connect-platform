import { Component, OnInit } from '@angular/core';
import { Link } from '../../models/link.model';
import { Box } from '../../models/box.model';
import { EditorModelService } from '../../services/editor-model.service';


@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(private model : EditorModelService) { }

  ngOnInit() {
    let b1 = new Box(240, 156, 156, 156);
    let b2 = new Box(240, 356, 156, 156);
    let l = new Link(b1, b2);

    this.model.nodes.push(b1);
    this.model.nodes.push(b2);
    this.model.links.push(l);
  }
}
