import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
import { catchError, from, of, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-edit-user-page',
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
  templateUrl: './edit-user-page.component.html',
  styleUrl: './edit-user-page.component.scss'
})
export class EditUserPageComponent {
  registerForm!: FormGroup;
  profiles: any[] = [];

  establishments: any[]= [];

  shouldShowEstabelecimento: boolean = false;

  userId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private establishmentService: EstablishmentService,
    private userAuthenticatedService: UserAuthenticatedService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', [Validators.required, Validators.minLength(3)]],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      telefoneId: [null], 
      perfil: ['', Validators.required], // Perfil do usuário
      estabelecimento: ['', Validators.required], // Estabelecimento do usuário
    });
  }

  async ngOnInit() {
    this.userAuthenticatedService.getPermissionResource("USUARIO").subscribe(
      (response) => {
        if (!response[0] || !response[0].atualizacao) {
          this.router.navigate(['home']); 
        }
  
        this.initForm();
      },
      (error) => {
        console.error('Erro ao carregar permissões:', error);
        this.router.navigate(['home']); 
      }
    );
  }

  async verificaPermisaso() {
    var userAuthenticated = await this.userAuthenticatedService.getUserLogado()

    if (userAuthenticated.isAdmin) {
      this.shouldShowEstabelecimento = true;
    } else {
      this.shouldShowEstabelecimento = false;
    }

  }

  loadUser(userId: string): void {
    this.userService.getUser(userId).subscribe(
      (user) => {
        if (user) {
          this.registerForm.patchValue({
            nome: user.nome,
            cpf: this.formatCpf(user.cpf), 
            email: user.email,
            cep: user.endereco.cep,
            logradouro: user.endereco.logradouro,
            numero: user.endereco.numero,
            bairro: user.endereco.bairro,
            cidade: user.endereco.cidade,
            estado: user.endereco.estado,
            telefone: this.formatTelefone(user.telefones[0].ddd, user.telefones[0].numero), 
            telefoneId: user.telefones[0].id || null,
            perfil: user.perfil.id,
            estabelecimento: user.estabelecimento || null,
          });
        }
  
        console.log(user);
      },
      (error) => {
        console.error('Erro ao carregar os dados do usuário:', error);
      }
    );
  }

  private formatTelefone(ddd: string | number, numero: string | number): string {
    const telefoneNumerico = numero.toString().replace(/\D/g, '');
    
    if (telefoneNumerico.length === 9) {
      return `(${ddd}) ${telefoneNumerico.slice(0, 5)}-${telefoneNumerico.slice(5)}`;
    } else {
      return `(${ddd}) ${telefoneNumerico.slice(0, 4)}-${telefoneNumerico.slice(4)}`;
    }
  }
  

  private formatCpf(cpf: string): string {
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
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

  private async initForm() {
    this.userId = this.route.snapshot.paramMap.get('id');


    this.loadProfiles();
    await this.verificaPermisaso();

    if(this.shouldShowEstabelecimento){
      this.loadEstablishments();
    }

   
    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  onSubmit(): void {
    console.log('Formulário enviado:', this.registerForm.value);
    if (this.registerForm.valid) {
      // Mapear os campos do formulário para o formato da requisição
      const requestBody = {
        id: this.userId,
        nome: this.registerForm.get('nome')?.value,
        email: this.registerForm.get('email')?.value,
        cpf: this.registerForm.get('cpf')?.value.replace(/\D/g, ''),
        endereco: {
          cep: this.registerForm.get('cep')?.value,
          estado: this.registerForm.get('estado')?.value,
          cidade: this.registerForm.get('cidade')?.value,
          bairro: this.registerForm.get('bairro')?.value,
          logradouro: this.registerForm.get('logradouro')?.value,
          numero: this.registerForm.get('numero')?.value,
        },
        telefones: [{
          id: this.registerForm.get('telefoneId')?.value,
          ddd: parseInt(this.registerForm.get('telefone')?.value.slice(1, 3), 10),
          numero: parseInt(this.registerForm.get('telefone')?.value.replace(/\D/g, '').slice(2), 10),
          descricao: 'Contato de usuario', 
          whatsapp: true
        }],
        perfilId: this.registerForm.get('perfil')?.value, 
        estabelecimentoId: this.shouldShowEstabelecimento ? this.registerForm.get('estabelecimento')?.value.id : 0
      };
      console.log(requestBody);

      // Enviar o corpo da requisição ao serviço
      this.userService.updateUser(requestBody).subscribe(
        (response) => {
          console.log('Registro realizado com sucesso:', response);
          this.router.navigate(['home']);
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
