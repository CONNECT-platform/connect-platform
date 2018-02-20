import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { PaneComponent } from './components/editor/pane/pane.component';
import { CardComponent } from './components/editor/card/card.component';
import { EditorService } from './services/editor.service';
import { BarComponent } from './components/editor/bar/bar.component';

import {FlexLayoutModule} from "@angular/flex-layout";
import { PinComponent } from './components/pin/pin.component';
import { LinkComponent } from './components/editor/link/link.component';
import { EditorModelService } from './services/editor-model.service';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PaneComponent,
    CardComponent,
    BarComponent,
    PinComponent,
    LinkComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule
  ],
  bootstrap: [AppComponent],
  providers: [EditorService, EditorModelService]
})
export class AppModule { }
