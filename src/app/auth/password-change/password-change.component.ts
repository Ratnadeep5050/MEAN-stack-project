import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth-service';

@Component({
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent {

  constructor(public authService: AuthService) {}

  onPasswordChange(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.passwordChange(form.value.email, form.value.password);
  }
}
