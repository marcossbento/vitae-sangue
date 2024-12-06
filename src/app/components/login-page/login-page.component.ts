import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    PasswordModule,
    DividerModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
senha: string = '';
email: string = '';

}
