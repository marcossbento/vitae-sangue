import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { NgModule } from '@angular/core';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FormComponent } from './components/form/form.component';
import { RegisterUserPageComponent } from './components/register-user-page/register-user-page.component';
import { RegisterProfilePageComponent } from './components/register-profile-page/register-profile-page.component';


export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'register-user', component: RegisterUserPageComponent },
  { path: 'register-profile', component: RegisterProfilePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'form', component: FormComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
