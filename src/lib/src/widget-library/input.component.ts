import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import * as _ from 'lodash';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  selector: 'input-widget',
  template: `
    <div [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <input *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode?.type">
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode?.type"
        [value]="controlValue"
        (input)="updateValue($event)">
        <datalist *ngIf="options?.typeahead?.source"
          [id]="'control' + layoutNode?._id + 'Autocomplete'">
          <option *ngFor="let word of options?.typeahead?.source" [value]="word">
        </datalist>
    </div>`,
})
export class InputComponent implements OnInit, OnDestroy {
  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  boundControl = false;
  options: any;
  autoCompleteList: string[] = [];
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
      this.jsf.dataChanges.distinctUntilChanged((current, prev) => _.isEqual(current, prev))
        .subscribe((values) => {
          if (this.controlDisabled) {
            this.formControl.disable();
          } else {
            this.formControl.enable();
          }
        });
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
}
