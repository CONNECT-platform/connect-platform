import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {FlexLayoutModule} from "@angular/flex-layout";
import {AceEditorModule} from "ng2-ace-editor";

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { PaneComponent } from './components/editor/pane/pane.component';
import { CardComponent } from './components/editor/card/card.component';
import { EditorService } from './services/editor.service';
import { RegistryService } from './services/registry.service';
import { BarComponent } from './components/editor/bar/bar.component';

import { PinComponent } from './components/editor/pin/pin.component';
import { LinkComponent } from './components/editor/link/link.component';
import { EditorModelService } from './services/editor-model.service';
import { CodeComponent } from './components/editor/code/code.component';
import { GeneralComponent } from './components/editor/general/general.component';
import { AdderComponent } from './components/editor/adder/adder.component';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    PaneComponent,
    CardComponent,
    BarComponent,
    PinComponent,
    LinkComponent,
    CodeComponent,
    GeneralComponent,
    AdderComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    AceEditorModule,
    FormsModule,
  ],
  bootstrap: [AppComponent],
  providers: [EditorModelService, EditorService, RegistryService]
})
export class AppModule { }
