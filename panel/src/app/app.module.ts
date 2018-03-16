import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import {FlexLayoutModule} from "@angular/flex-layout";
import {AceEditorModule} from "ng2-ace-editor";

import { AppComponent } from './app.component';
import { EditorComponent } from './components/editor/editor.component';
import { PaneComponent } from './components/editor/pane/pane.component';
import { CardComponent } from './components/editor/card/card.component';
import { EditorService } from './services/editor.service';
import { RegistryService } from './services/registry.service';
import { BarComponent } from './components/editor/bar/bar.component';
import { BackendService } from './services/backend.service';

import { PinComponent } from './components/editor/pin/pin.component';
import { LinkComponent } from './components/editor/link/link.component';
import { EditorModelService } from './services/editor-model.service';
import { CodeComponent } from './components/editor/code/code.component';
import { GeneralComponent } from './components/editor/general/general.component';
import { AdderComponent } from './components/editor/adder/adder.component';
import { HomeComponent } from './components/home/home.component';
import { NodesComponent } from './components/home/nodes/nodes.component';
import { OverlayComponent } from './components/shared/overlay/overlay.component';


const routes : Routes = [
  {path: '', component: HomeComponent},
  {path : 'editor', component: EditorComponent},
]

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
    HomeComponent,
    NodesComponent,
    OverlayComponent,
  ],
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false }),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AceEditorModule,
    FormsModule,
    HttpClientModule,
  ],
  schemas:      [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent],
  providers: [
    Location,{provide: LocationStrategy, useClass: PathLocationStrategy},
    BackendService, RegistryService, EditorModelService, EditorService]
})
export class AppModule { }
