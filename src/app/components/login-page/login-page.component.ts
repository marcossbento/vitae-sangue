import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FloatLabelModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    PasswordModule,
    DividerModule,
    RouterModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
senha: string = '';
email: string = '';
errorMessage: string = '';
constructor(private authService: AuthService, private router: Router) {}


onLogin(): void {
  this.authService.login(this.email, this.senha).subscribe(
    (response) => {
      localStorage.setItem('authToken', response.token);
      this.router.navigate(['home']);
    },
    (error) => {
      alert('Credenciais inválidas. Tente novamente.');
      console.error('Erro ao fazer login:', error);
    }
  );
}
}