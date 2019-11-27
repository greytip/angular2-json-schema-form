import { Component, Input, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap } from '../shared';
import {  isArray } from '../shared/validator.functions';
import { FormBehaviourActionService } from '../shared/form-behaviour-action.service';

@Component({
  selector: 'select-widget',
  template: `
    <div
      [class]="options?.htmlClass || ''"
      >
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <select *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        (change)="handleChange($event)"
        [name]="controlName">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [ngValue]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [ngValue]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
      <select *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode?._id"
        [name]="controlName"
        (change)="updateValue($event)">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [selected]="selectItem?.value === controlValue"
            [ngValue]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [attr.selected]="subItem?.value === controlValue"
              [ngValue]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
    </div>`,
})
export class SelectComponent implements OnInit, AfterViewInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  boundControl = false;
  options: any;
  selectList: any[] = [];
  isArray = isArray;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    private jsf: JsonSchemaFormService,
    private formBehaviourActionService: FormBehaviourActionService
  ) { }
  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.selectList = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, !!this.options.required, !!this.options.flatList
    );
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
        JSON.parse($event.target.value.split(':')[1].trim()),
        this.jsf.formGroup,
        this.jsf.formOptions.activateConditionallyRequired
      );
    }
  }
}
