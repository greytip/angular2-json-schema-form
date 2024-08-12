import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

import { JsonSchemaFormService } from '../../json-schema-form.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'material-slider-widget',
  template: `
    <mat-slider thumbLabel *ngIf="boundControl"
      [formControl]="formControl"
      [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
      [id]="'control' + layoutNode?._id"
      [max]="options?.maximum"
      [min]="options?.minimum"
      [step]="options?.multipleOf || options?.step || 'any'"
      [style.width]="'100%'"
      (blur)="options.showErrors = true"></mat-slider>
    <mat-slider thumbLabel *ngIf="!boundControl"
      [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
      [disabled]="controlDisabled || options?.readonly"
      [id]="'control' + layoutNode?._id"
      [max]="options?.maximum"
      [min]="options?.minimum"
      [step]="options?.multipleOf || options?.step || 'any'"
      [style.width]="'100%'"
      [value]="controlValue"
      (blur)="options.showErrors = true"
      (change)="updateValue($event)"></mat-slider>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
    styles: [` mat-error { font-size: 75%; } `],
})
export class MaterialSliderComponent implements OnInit, OnDestroy {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  boundControl = false;
  options: any;
  allowNegative = true;
  allowDecimal = true;
  allowExponents = false;
  lastValidNumber = '';
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  private dataChanges$: Subscription;

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsf.initializeControl(this, !this.options.readonly);

    this.dataChanges$ =
      this.jsf.dataChanges.pipe(distinctUntilChanged((current, prev) => _.isEqual(current, prev)))
        .subscribe((values) => { this.updateDisabled(); });

    // Ugly hack to disable field after rendering.
    // TODO: Try to do this is in buildFormGroupTemplate.
    setTimeout(() => { this.updateDisabled(); });
  }

  ngOnDestroy() {
    this.dataChanges$.unsubscribe();
  }

  get controlDisabled(): boolean {
    return this.jsf.evaluateDisabled(this.layoutNode, this.dataIndex);
  }

  updateValue(event) {
    this.options.showErrors = true;
    this.jsf.updateValue(this, event.value);
  }

  updateDisabled() {
    if (this.controlDisabled) { this.formControl.disable(); }
    else { this.formControl.enable(); }
  }
}
