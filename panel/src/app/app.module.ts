import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FlexLayoutModule} from "@angular/flex-layout";
import {AceEditorModule} from "ng2-ace-editor";

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { PaneComponent } from './components/editor/pane/pane.component';
import { CardComponent } from './components/editor/card/card.component';
import { EditorService } from './services/editor.service';
import { BarComponent } from './components/editor/bar/bar.component';

import { PinComponent } from './components/editor/pin/pin.component';
import { LinkComponent } from './components/editor/link/link.component';
import { EditorModelService } from './services/editor-model.service';
import { ExprComponent } from './components/editor/expr/expr.component';
import { EntriesPipe } from './util/entries.pipe';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PaneComponent,
    CardComponent,
    BarComponent,
    PinComponent,
    LinkComponent,
    ExprComponent,
    EntriesPipe,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AceEditorModule,
  ],
  bootstrap: [AppComponent],
  providers: [EditorService, EditorModelService]
})
export class AppModule { }
