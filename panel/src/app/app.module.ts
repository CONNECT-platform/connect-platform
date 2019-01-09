import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { TesterService } from './services/tester.service';
import { HintService } from './services/hint.service';
import { TokenService } from './services/token.service';
import { RepoService } from './services/repo.service';

import { PinComponent } from './components/editor/pin/pin.component';
import { LinkComponent } from './components/editor/link/link.component';
import { EditorModelService } from './services/editor-model.service';
import { CodeComponent } from './components/editor/code/code.component';
import { GeneralComponent } from './components/editor/general/general.component';
import { AdderComponent } from './components/editor/adder/adder.component';
import { HomeComponent } from './components/home/home.component';
import { NodesComponent } from './components/home/nodes/nodes.component';
import { OverlayComponent } from './components/shared/overlay/overlay.component';
import { TimelineComponent } from './components/editor/timeline/timeline.component';
import { HintmanComponent } from './components/shared/hintman/hintman.component';
import { AuthComponent } from './components/auth/auth.component';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { ConfigComponent } from './components/home/config/config.component';
import { PackagesComponent } from './components/home/packages/packages.component';
import { VaultComponent } from './components/home/vault/vault.component';
import { ServicesComponent } from './components/home/services/services.component';
import { EditorMiscOverlayComponent } from './components/editor/overlays/editor-misc-overlay/editor-misc-overlay.component';
import { SelectorComponent } from './components/editor/pane/selector/selector.component';


const routes : Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path : 'editor', component: EditorComponent },
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
    TimelineComponent,
    HintmanComponent,
    AuthComponent,
    ConfigComponent,
    VaultComponent,
    PackagesComponent,
    ServicesComponent,
    EditorMiscOverlayComponent,
    SelectorComponent,
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
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    BackendService,
    RegistryService,
    EditorModelService,
    EditorService,
    TesterService,
    HintService,
    TokenService,
    RepoService,
  ],
  entryComponents: [
    NodesComponent,
    ConfigComponent,
    VaultComponent,
    PackagesComponent,
    ServicesComponent,
  ]
})
export class AppModule { }
