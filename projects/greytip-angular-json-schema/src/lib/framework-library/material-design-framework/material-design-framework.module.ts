import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {  MatAutocompleteModule } from "@angular/material/autocomplete";
import {  MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import {  MatCardModule } from "@angular/material/card";
import {  MatCheckboxModule } from "@angular/material/checkbox";
import {  MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import {  MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import {  MatInputModule } from "@angular/material/input";
import {  MatRadioModule } from "@angular/material/radio";
import {  MatSelectModule } from "@angular/material/select";
import {  MatSlideToggleModule } from "@angular/material/slide-toggle";
import {  MatSliderModule } from "@angular/material/slider";
import { MatStepperModule } from "@angular/material/stepper";
import {  MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
export const ANGULAR_MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTabsModule,
  MatTooltipModule,
];
/**
 * unused @angular/material modules:
 * MatDialogModule, MatGridListModule, MatListModule, MatMenuModule,
 * MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule,
 * MatSidenavModule, MatSnackBarModule, MatSortModule, MatTableModule,
 * MatToolbarModule,
 */

import { JsonSchemaFormService } from "../../json-schema-form.service";
import { WidgetLibraryModule } from "../../widget-library/widget-library.module";
import { Framework } from "../framework";
import { MATERIAL_FRAMEWORK_COMPONENTS } from "./index";
import { MaterialDesignFramework } from "./material-design.framework";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...ANGULAR_MATERIAL_MODULES,
    WidgetLibraryModule,
  ],
  declarations: [...MATERIAL_FRAMEWORK_COMPONENTS],
  exports: [...MATERIAL_FRAMEWORK_COMPONENTS],
})
export class MaterialDesignFrameworkModule {
  static forRoot(): ModuleWithProviders<MaterialDesignFrameworkModule> {
    return {
      ngModule: MaterialDesignFrameworkModule,
      providers: [
        { provide: Framework, useClass: MaterialDesignFramework, multi: true },
      ],
    };
  }
}
