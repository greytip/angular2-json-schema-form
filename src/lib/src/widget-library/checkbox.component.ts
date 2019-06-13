import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { FormBehaviourActionService } from '../shared/form-behaviour-action.service';
import { isArray } from '../shared';

@Component({
  selector: 'checkbox-widget',
  template: `
    <label
      [attr.for]="'control' + layoutNode?._id"
      [class]="options?.itemLabelHtmlClass || ''"
    >
      <input
        *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [class]="
          (options?.fieldHtmlClass || '') +
          (isChecked
            ? ' ' +
              (options?.activeClass || '') +
              ' ' +
              (options?.style?.selected || '')
            : ' ' + (options?.style?.unselected || ''))
        "
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        (change)="handleChange($event)"
        type="checkbox"
      />
      <input
        *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [checked]="isChecked ? 'checked' : null"
        [class]="
          (options?.fieldHtmlClass || '') +
          (isChecked
            ? ' ' +
              (options?.activeClass || '') +
              ' ' +
              (options?.style?.selected || '')
            : ' ' + (options?.style?.unselected || ''))
        "
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [value]="controlValue"
        type="checkbox"
        (change)="updateValue($event)"
      />
      <span
        *ngIf="options?.title"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"
      ></span>
    </label>
  `
})
export class CheckboxComponent implements OnInit, AfterViewInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  boundControl = false;
  options: any;
  trueValue: any = true;
  falseValue: any = false;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    private jsf: JsonSchemaFormService,
    private formBehaviourActionService: FormBehaviourActionService
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsf.initializeControl(this);
    if (this.controlValue === null || this.controlValue === undefined) {
      this.controlValue = this.options.title;
    }
  }
  updateValue(event) {
    event.preventDefault();
    this.jsf.updateValue(
      this,
      event.target.checked ? this.trueValue : this.falseValue
    );
    this.handleChange(event);
  }
  ngAfterViewInit() {
    if (this.isformBehaviourAction) {
      setTimeout(() => {
        this.formBehaviourActionService.initActions(
          this.options.formBehaviourActions,
          this.isChecked,
          this.jsf.formGroup
        );
      });
    }
  }
  get isChecked() {
    return this.jsf.getFormControlValue(this) === this.trueValue;
  }
  get isformBehaviourAction() {
    return (
      this.jsf.formOptions.activateFormBehaviourActions &&
      isArray(this.options.formBehaviourActions) &&
      this.options.formBehaviourActions.length > 0
    );
  }
  handleChange($event) {
    if (this.isformBehaviourAction) {
      this.formBehaviourActionService.initActions(
        this.options.formBehaviourActions,
        $event.target.checked,
        this.jsf.formGroup
      );
    }
  }
}
