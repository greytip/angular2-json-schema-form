import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {  MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import {  MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import {  MatMenuModule } from "@angular/material/menu";
import {  MatSelectModule } from "@angular/material/select";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";

// To include JsonSchemaFormModule after downloading from NPM, use this instead:
//
//   import { JsonSchemaFormModule, NoFrameworkModule } from 'angular2-json-schema-form';
//
// but replace "NoFrameworkModule" with the framework you want to use,
// then import both JsonSchemaFormModule and the framework module, like this:
//
//   imports: [ ... NoFrameworkModule, JsonSchemaFormModule.forRoot(NoFrameworkModule) ... ]

import { AceEditorDirective } from "./ace-editor.directive";
import { DemoComponent } from "./demo.component";
import { DemoRootComponent } from "./demo-root.component";

import { routes } from "./demo.routes";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Bootstrap3Framework,
  Bootstrap3FrameworkModule,
  Bootstrap4FrameworkModule,
  Framework,
  FrameworkLibraryService,
  JsonSchemaFormModule,
  JsonSchemaFormService,
  MaterialDesignFrameworkModule,
  NoFrameworkModule,
  WidgetLibraryService,
} from "../../../projects/greytip-angular-json-schema/src/public-api";

@NgModule({
  declarations: [AceEditorDirective, DemoComponent, DemoRootComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    RouterModule.forRoot(routes),

    NoFrameworkModule,
    MaterialDesignFrameworkModule,
    Bootstrap3FrameworkModule,
    Bootstrap4FrameworkModule,

    {
      ngModule: JsonSchemaFormModule,
      providers: [
        JsonSchemaFormService,
        FrameworkLibraryService,
        WidgetLibraryService,
        { provide: Framework, useClass: Bootstrap3Framework, multi: true },
      ],
    },
  ],
  bootstrap: [DemoRootComponent],
})

// Here, by loading 4 frameworks in JsonSchemaFormModule.forRoot(), the first,
// `NoFrameworkModule`, will be set active by default. But any of the 4 can
// be activated later by passing the framework's name to the <json-schema-form>
// tag's `framework` input. The names of these 4 frameworks are:
//   'no-framework'
//   'material-design-framework',
//   'bootstrap-3-framework'
//   'bootstrap-4-framework'
export class DemoModule {}
