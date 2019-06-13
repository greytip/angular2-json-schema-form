import { Injectable } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';

import { Validators } from '@angular/forms';
import { getFormControl } from './utility.functions';
import { capitalCase } from './validator.functions';

@Injectable()
export class FormBehaviourActionService {
  constructor(private jsf: JsonSchemaFormService) {}
  initActions(formBehaviourActions, val, fg) {
    formBehaviourActions.forEach(action => {
      this.handleBehaviourChange(action, val, fg);
    });
  }
  private handleBehaviourChange(action, val, fg) {
    let targetFormControls = getFormControl(action.key, fg);
    action.types.forEach(actionTypes => {
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
  private handleRequired(formControls, condition, val): void {
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

  private handleValue(formControls, condition, val): void {
    if (this.jsf.evaluateFunctionBody(condition, val)) {
      formControls.forEach(formControl => formControl.setValue(''));
    };
  }
}
