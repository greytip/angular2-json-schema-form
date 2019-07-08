import { Component, Input, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { FormBehaviourActionService } from '../shared/form-behaviour-action.service';
import { isArray } from '../shared';
import { Subscription } from 'rxjs/Subscription';

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
        (change)="handleChange($event.target.checked)"
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
export class CheckboxComponent implements OnInit, OnDestroy, AfterViewInit {
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
  newItemsAddedSubscriber: Subscription;

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
   this.newItemsAddedSubscriber = this.jsf.newItemsAdded.subscribe((val) => {
     setTimeout(() => {
      this.handleChange(this.isChecked);
     })
    })
  }
  ngOnDestroy() {
    this.newItemsAddedSubscriber.unsubscribe();
  }
  updateValue(event) {
    event.preventDefault();
    this.jsf.updateValue(
      this,
      event.target.checked ? this.trueValue : this.falseValue
    );
    this.handleChange(event.target.checked);
  }
  ngAfterViewInit() {
    if (this.isformBehaviourAction) {
      setTimeout(() => {
        this.formBehaviourActionService.initActions(
          this.options.formBehaviourActions,
          this.isChecked,
          this.jsf.formGroup,
          this.jsf.formOptions.activateConditionallyRequired
        );
      });
    }
  }
  get isChecked() {
    return this.jsf.getFormControlValue(this) === this.trueValue;
  }
  get isformBehaviourAction() {
    return (
      isArray(this.options.formBehaviourActions) &&
      this.options.formBehaviourActions.length > 0
    );
  }
  handleChange(val) {
    if (this.isformBehaviourAction) {
      this.formBehaviourActionService.initActions(
        this.options.formBehaviourActions,
        val,
        this.jsf.formGroup,
        this.jsf.formOptions.activateConditionallyRequired
      );
    }
  }
}
