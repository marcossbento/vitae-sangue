import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, ValidationErrors, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UserService } from '../../services/user.service';
import { EstablishmentService } from '../../services/establishment.service';
import { UserAuthenticatedService } from '../../services/user-authenticated.service';


@Component({
  selector: 'app-reset-password-user-page',
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
  templateUrl: './reset-password-user-page.component.html',
  styleUrl: './reset-password-user-page.component.scss'
})
export class ResetPasswordUserPageComponent {
  registerForm!: FormGroup;

  userId: any;

  usuario: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(userId: string): void {
    // Simula a busca de dados do usuário por um serviço (substitua pelo seu UserService)
    this.userService.getUser(userId).subscribe(
      (user) => {
        if (user) {
          this.usuario = user;
        }
      },
      (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    );
  }
  


  private initForm(): void {
    this.registerForm = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validators: this.validarSenhasIguais
    });
  }
  
  private validarSenhasIguais(form: AbstractControl): ValidationErrors | null {
    const senha = form.get('senha');
    const confirmarSenha = form.get('confirmarSenha');
  
    if (senha?.value === confirmarSenha?.value) {
      return null;
    }
  
    return { senhasDiferentes: true };
  }

  onSubmit(): void {
    console.log('Formulário enviado:', this.registerForm.value);
    if (this.registerForm.valid) {
      // Mapear os campos do formulário para o formato da requisição
      const requestBody = {
        userId: this.userId,
        senha: this.registerForm.get('senha')?.value
      };
      console.log(requestBody);

      // Enviar o corpo da requisição ao serviço
      this.userService.resetPasswordUser(requestBody).subscribe(
        (response) => {
          console.log('Registro alterado com sucesso:', response);
          this.router.navigate(['home']);
        },
        (error) => {
          console.error('Erro ao alterado registro:', error);
          alert('Erro ao alterar. Por favor, tente novamente.');
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
