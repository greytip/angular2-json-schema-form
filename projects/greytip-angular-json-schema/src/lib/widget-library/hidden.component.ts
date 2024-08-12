import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

import { JsonSchemaFormService } from '../json-schema-form.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'hidden-widget',
  template: `
    <input *ngIf="boundControl"
      [formControl]="formControl"
      [id]="'control' + layoutNode?._id"
      [name]="controlName"
      type="hidden">
    <input *ngIf="!boundControl"
      [disabled]="controlDisabled"
      [name]="controlName"
      [id]="'control' + layoutNode?._id"
      type="hidden"
      [value]="controlValue">`,
})
export class HiddenComponent implements OnInit, OnDestroy {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  boundControl = false;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  private dataChanges$: Subscription;

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.jsf.initializeControl(this);

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

  updateDisabled() {
    if (this.controlDisabled) { this.formControl.disable(); }
    else { this.formControl.enable(); }
  }
}
