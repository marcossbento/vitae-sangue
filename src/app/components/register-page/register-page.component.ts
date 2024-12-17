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

@Component({
  selector: 'app-register-page',
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
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent {
  registerForm!: FormGroup;
  tipoEstabelecimento: any[] = [
    { label: 'Público', value: 'Público' },
    { label: 'Particular', value: 'Particular' },
    { label: 'Filantrópico', value: 'Filantrópico' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required, Validators.minLength(3)],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      tipoEstabelecimento: ['', Validators.required],
      diretor: ['', Validators.required],
      cnes: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Implementar lógica de submissão
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
