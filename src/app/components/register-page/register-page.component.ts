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
    HttpClientModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  providers: [RegisterService]
})
export class RegisterPageComponent {
  registerForm!: FormGroup;

  showCnes: boolean = true;
  showTipoHospital: boolean = true;
  showDiretor: boolean = true;

  tipoEstabelecimento: any[] = [
    { label: 'Hospital', value: 'Hospital' },
    { label: 'Hemocentro', value: 'Hemocentro' }
  ];

  tipoHospital: any[] = [
    { label: 'Público', value: 'Publico' },
    { label: 'Particular', value: 'Particular' },
    { label: 'Filantrópico', value: 'Filantropico' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const tipoEstabelecimentoControl = this.registerForm.get('tipoEstabelecimento');
    console.log('Valor inicial tipoEstabelecimento:', tipoEstabelecimentoControl?.value);  // Verifique o valor inicial
    tipoEstabelecimentoControl?.valueChanges.subscribe((value) => {
      console.log('Novo valor de tipoEstabelecimento:', value);  // Verifique se o valueChanges está sendo disparado corretamente
      this.toggleFieldsBasedOnEstabelecimento(value);
    });
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      tipoEstabelecimento: ['', Validators.required],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', [Validators.required, Validators.minLength(3)]],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      tipoHospital: ['', Validators.required],
      diretor: ['', Validators.required],
      cnes: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
    });

    this.toggleFieldsBasedOnEstabelecimento(this.registerForm.get('tipoEstabelecimento')?.value);
  }

  private toggleFieldsBasedOnEstabelecimento(value: { label: string, value: string } | null): void {
    // Verifique se o valor não é null e use a propriedade 'value'
    const tipoEstabelecimento = value?.value || '';

    console.log('toggleFieldsBasedOnEstabelecimento chamado com valor:', tipoEstabelecimento);

    if (tipoEstabelecimento === 'Hemocentro') {
      this.showCnes = false;
      this.showTipoHospital = false;
      this.showDiretor = false;

      this.registerForm.get('cnes')?.disable();
      this.registerForm.get('tipoHospital')?.disable();
      this.registerForm.get('diretor')?.disable();
    } else {
      this.showCnes = true;
      this.showTipoHospital = true;
      this.showDiretor = true;

      this.registerForm.get('cnes')?.enable();
      this.registerForm.get('tipoHospital')?.enable();
      this.registerForm.get('diretor')?.enable();
    }
  }

  onSubmit(): void {
    console.log('Formulário enviado:', this.registerForm.value);
    if (this.registerForm.valid) {
      // Mapear os campos do formulário para o formato da requisição
      const requestBody = {
        nome: this.registerForm.get('nome')?.value,
        email: this.registerForm.get('email')?.value,
        endereco: {
          cep: this.registerForm.get('cep')?.value,
          estado: this.registerForm.get('estado')?.value,
          cidade: this.registerForm.get('cidade')?.value,
          bairro: this.registerForm.get('bairro')?.value,
          logradouro: this.registerForm.get('logradouro')?.value,
          numero: this.registerForm.get('numero')?.value,
        },
        ddd: parseInt(this.registerForm.get('telefone')?.value.slice(1, 3), 10),
        numeroTelefone: parseInt(this.registerForm.get('telefone')?.value.replace(/\D/g, '').slice(2), 10),
        tipoEstabelecimento: "HEMOCENTRO",
        tipoHospital: null, // Certifique-se de que este valor corresponde à enum do backend
        diretorResponsavel: this.registerForm.get('diretor')?.value,
      };

      // Enviar o corpo da requisição ao serviço
      this.registerService.register(requestBody).subscribe(
        (response) => {
          console.log('Registro realizado com sucesso:', response);
          this.router.navigate(['login']);
        },
        (error) => {
          console.error('Erro ao realizar registro:', error);
          alert('Erro ao registrar. Por favor, tente novamente.');
        }
      );
    } else {
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });
    }

  }
}
