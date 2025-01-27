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
import { RegisterService } from '../../services/register.service';
import { ProfileService } from '../../services/profile.service';
import { HemocentroService } from '../../services/hemocentro.service';
import { EstablishmentService } from '../../services/establishment.service';

@Component({
  selector: 'app-register-user-page',
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
  templateUrl: './register-user-page.component.html',
  styleUrls: ['./register-user-page.component.scss'],
  providers: [RegisterService]
})
export class RegisterUserPageComponent {
  registerForm!: FormGroup;
  profiles: any[] = [];

  establishments: any[]= [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private profileService: ProfileService,
    private hemocentroService: HemocentroService,
    private establishmentService: EstablishmentService

  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProfiles();
    this.loadEstablishments();
    const perfilControl = this.registerForm.get('perfil');
    console.log('Valor inicial perfil:', perfilControl?.value);  // Verifique o valor inicial
    perfilControl?.valueChanges.subscribe((value) => {
      console.log('Novo valor de perfil:', value);  // Verifique se o valueChanges está sendo disparado corretamente
    });
  }

  private loadProfiles(): void {
    this.profileService.getProfiles().subscribe({
      next: (response) => {
        console.log('Resposta da API:', response);
        this.profiles = response || [];
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
      }
    });
  }

  private loadEstablishments(): void {
    this.establishmentService.getEstabelecimento().subscribe({
      next: (response) => {
        console.log('Resposta da API 2:', response);
        this.establishments = response || [];
      },
      error: (error) => {
        console.error('Error loading establishments:', error);
      }
    });
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', [Validators.required, Validators.minLength(3)]],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      perfil: ['', Validators.required], // Perfil do usuário
      estabelecimento: ['', Validators.required], // Estabelecimento do usuário
    });
  }

  onSubmit(): void {
    console.log('Formulário enviado:', this.registerForm.value);
    if (this.registerForm.valid) {
      // Mapear os campos do formulário para o formato da requisição
      const requestBody = {
        nome: this.registerForm.get('nome')?.value,
        email: this.registerForm.get('email')?.value,
        senha: this.registerForm.get('senha')?.value,
        cpf: this.registerForm.get('cpf')?.value,
        endereco: {
          cep: this.registerForm.get('cep')?.value,
          estado: this.registerForm.get('estado')?.value,
          cidade: this.registerForm.get('cidade')?.value,
          bairro: this.registerForm.get('bairro')?.value,
          logradouro: this.registerForm.get('logradouro')?.value,
          numero: this.registerForm.get('numero')?.value,
        },
        telefones: [{
          ddd: parseInt(this.registerForm.get('telefone')?.value.slice(1, 3), 10),
          numero: parseInt(this.registerForm.get('telefone')?.value.replace(/\D/g, '').slice(2), 10)
        }],
        perfil: this.registerForm.get('perfil')?.value, // Enum ou valor do perfil
        estabelecimento: this.registerForm.get('estabelecimento')?.value, // Estabelecimento associado ao usuário
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