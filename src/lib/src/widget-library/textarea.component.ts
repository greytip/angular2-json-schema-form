import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { isArray } from './../shared/validator.functions';
import { FormBehaviourActionService } from '../shared/form-behaviour-action.service';

@Component({
  selector: 'textarea-widget',
  template: `
    <div
      [class]="options?.htmlClass || ''"  >
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
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        (change)="handleChange($event)"
        [name]="controlName"></textarea>
      <textarea *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        [value]="controlValue"
        (input)="updateValue($event)">{{controlValue}}</textarea>
    </div>`,
})
export class TextareaComponent implements OnInit, AfterViewInit {
 formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];


  constructor(
    private jsf: JsonSchemaFormService,
    private formBehaviourActionService: FormBehaviourActionService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsf.initializeControl(this);
  }
  ngAfterViewInit() {
    if (this.isformBehaviourAction) {
      setTimeout(() => {
        this.formBehaviourActionService.initActions(
          this.options.formBehaviourActions,
          this.controlValue,
          this.jsf.formGroup
        );
      });
    }
  }
  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
    this.handleChange(event);
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
        $event.target.value,
        this.jsf.formGroup
      );
    }
  }
}
