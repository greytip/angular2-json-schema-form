import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { FormBehaviourActionService } from '../shared/form-behaviour-action.service';
import { isArray } from '../shared';

@Component({
  selector: 'input-widget',
  template: `
    <div [class]="options?.htmlClass || ''" >
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
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        (change)="handleChange($event)"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode?.type">
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [class]="options?.fieldHtmlClass || ''"
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
export class InputComponent implements OnInit, AfterViewInit {
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
          this.jsf.formGroup,
          this.jsf.formOptions.activateConditionallyRequired
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
      isArray(this.options.formBehaviourActions) &&
      this.options.formBehaviourActions.length > 0
    );
  }
  handleChange($event) {
    if (this.isformBehaviourAction) {
      this.formBehaviourActionService.initActions(
        this.options.formBehaviourActions,
        $event.target.value,
        this.jsf.formGroup,
        this.jsf.formOptions.activateConditionallyRequired
      );
    }
  }
}
