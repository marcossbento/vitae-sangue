import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../register.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox'; 

@Component({
  selector: 'app-register-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    FloatLabelModule,
    InputNumberModule,
    FormsModule,
    InputMaskModule,
    DropdownModule,
    HttpClientModule,
    MultiSelectModule,
    CheckboxModule,
  ],
  templateUrl: './register-profile-page.component.html',
  styleUrls: ['./register-profile-page.component.scss'],
})
export class RegisterProfilePageComponent {
  registerProfileForm!: FormGroup;

  estabelecimentoOptions: any[] = [
    { label: 'Hemonúcleo Araraquara', value: 'Hemocentro' },
    { label: 'Santa Casa de Araraquara', value: 'Hospital' },
  ];

  permissaoOptions: any[] = [
    { label: 'Visualizar Dados', value: 'VIEW_DATA' },
    { label: 'Editar Dados', value: 'EDIT_DATA' },
    { label: 'Excluir Dados', value: 'DELETE_DATA' },
    { label: 'Gerenciar Usuários', value: 'MANAGE_USERS' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.registerProfileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      estabelecimento: ['', Validators.required],
      isAdminSistema: [false],
      permissoes: [[], Validators.required],
    });
  }

  onSubmit(): void {
    console.log('Formulário de perfil enviado:', this.registerProfileForm.value);
    if (this.registerProfileForm.valid) {
      const requestBody = {
        nome: this.registerProfileForm.get('nome')?.value,
        estabelecimento: this.registerProfileForm.get('estabelecimento')?.value,
        isAdminSistema: this.registerProfileForm.get('isAdminSistema')?.value,
        permissoes: this.registerProfileForm.get('permissoes')?.value,
      };

      this.registerService.register(requestBody).subscribe(
        (response) => {
          console.log('Perfil registrado com sucesso:', response);
          this.router.navigate(['profile-list']);
        },
        (error) => {
          console.error('Erro ao registrar perfil:', error);
          alert('Erro ao registrar o perfil. Por favor, tente novamente.');
        }
      );
    } else {
      Object.keys(this.registerProfileForm.controls).forEach((key) => {
        const control = this.registerProfileForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['profile-list']);
  }
}