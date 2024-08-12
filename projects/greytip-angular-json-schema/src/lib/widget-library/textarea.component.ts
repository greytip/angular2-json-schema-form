import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import * as _ from 'lodash';

import { JsonSchemaFormService } from '../json-schema-form.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'textarea-widget',
  template: `
    <div
      [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <textarea *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"></textarea>
      <textarea *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [value]="controlValue"
        (input)="updateValue($event)">{{controlValue}}</textarea>
    </div>`,
})
export class TextareaComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  private dataChanges$: Subscription;

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
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

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  updateDisabled() {
    if (this.controlDisabled) { this.formControl.disable(); }
    else { this.formControl.enable(); }
  }
}
