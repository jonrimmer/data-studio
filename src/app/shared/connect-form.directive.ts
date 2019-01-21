import { Directive, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

// Based on https://medium.com/@amcdnl/reactive-angular-forms-with-ngrx-533a2f28c127

@Directive({
  selector: '[dsConnectForm]'
})
export class ConnectFormDirective {
  @Input('dsConnectForm')
  set data(val: any) {
    if (val) {
      this.formGroupDirective.form.patchValue(val);
      this.formGroupDirective.form.markAsPristine();
    }
  }
  
  constructor(private formGroupDirective: FormGroupDirective) {}
}
