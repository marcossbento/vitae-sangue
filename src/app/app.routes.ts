import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { NgModule } from '@angular/core';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ContractFormComponent } from './components/contract-form/contract-form.component';
import { RegisterUserPageComponent } from './components/register-user-page/register-user-page.component';
import { RegisterProfilePageComponent } from './components/register-profile-page/register-profile-page.component';
import { EditProfilePageComponent } from './components/edit-profile-page/edit-profile-page.component';
import { RequisitionFormComponent } from './components/requisition-form/requisition-form.component';
import { EditUserPageComponent } from './components/edit-user-page/edit-user-page.component';
import { ResetPasswordUserPageComponent } from './components/reset-password-user-page/reset-password-user-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'user/create', component: RegisterUserPageComponent },
  { path: 'user/edit/:id', component: EditUserPageComponent },
  { path: 'user/:id/reset-password', component: ResetPasswordUserPageComponent },
  { path: 'profile/create', component: RegisterProfilePageComponent },
  { path: 'profile/edit/:id', component: EditProfilePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'contractForm', component: ContractFormComponent },
  { path: 'requisitionForm', component: RequisitionFormComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
