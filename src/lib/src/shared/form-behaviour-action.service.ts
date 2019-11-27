import { Injectable } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';

import { Validators } from '@angular/forms';
import { getFormControl } from './utility.functions';
import { capitalCase } from './validator.functions';

@Injectable()
export class FormBehaviourActionService {
  constructor(private jsf: JsonSchemaFormService) { }
  initActions(formBehaviourActions, val, fg, activateConditionallyRequired) {
    formBehaviourActions.forEach(action => {
      this.handleBehaviourChange(action, val, fg, activateConditionallyRequired);
    });
  }
  private handleBehaviourChange(action, val, fg, activateConditionallyRequired) {
    let targetFormControls = getFormControl(action.key, fg);
    action.types.filter((actionTypes) => {
      return activateConditionallyRequired || actionTypes !== 'optional';
    }).forEach(actionTypes => {
      this['handle' + capitalCase(actionTypes)](
        targetFormControls,
        action.condition,
        val
      );
    });
  }
  private handleDisable(formControls, condition, val): void {
    if (this.jsf.evaluateFunctionBody(condition, val)) {
      formControls.forEach(formControl => formControl.disable());
    } else {
      formControls.forEach(formControl => formControl.enable());
    }
  }
  private handleOptional(formControls, condition, val): void {
    if (!this.jsf.evaluateFunctionBody(condition, val)) {
      formControls.forEach(formControl => {
        formControl.setValidators([Validators.required]);
        formControl.nativeElement
          .closest('.form-group')
          .classList.add('isRequired');
        formControl.updateValueAndValidity();
      });
    } else {
      formControls.forEach(formControl => {
        formControl.clearValidators();
        formControl.nativeElement
          .closest('.form-group')
          .classList.remove('isRequired');
        formControl.updateValueAndValidity();
      });
    }
  }

  private handleHidevalue(formControls, condition, val): void {
    if (this.jsf.evaluateFunctionBody(condition, val)) {
      formControls.forEach(formControl => formControl.setValue(''));
    };
  }
}
