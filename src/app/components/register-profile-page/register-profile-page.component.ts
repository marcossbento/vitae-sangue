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
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { UserAuthenticatedService } from './../../services/user-authenticated.service';
import { EstablishmentService } from './../../services/establishment.service';
import { ProfileService } from '../../services/profile.service';
import { catchError, from, of, switchMap, tap } from 'rxjs';

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

  estabelecimentoOptions: any[] = [ ];

  permissions = [
    'USUARIO', 'BOLSA_REQUISICAO', 'BOLSA_ENTREGA', 'CONTRATO',
    'BOLSA_DESCARTE', 'ESTABELECIMENTO', 'HEMOCENTRO', 'HISTORICO',
    'HOSPITAL', 'PERFIL', 'SOLICITACAO_ACESSO', 'BOLSA_UTILIZACAO'
  ];

  shouldShowEstabelecimento: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private userAuthenticatedService: UserAuthenticatedService,
    private establishmentService: EstablishmentService

  ) {
    const permissionControls: { [key: string]: any } = {};

    this.permissions.forEach(permission => {
      permissionControls[`${permission}_visualizar`] = [false];
      permissionControls[`${permission}_criar`] = [false];
      permissionControls[`${permission}_editar`] = [false];
      permissionControls[`${permission}_deletar`] = [false];
      permissionControls[`${permission}_id`] = [null];
    });

    this.registerProfileForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      estabelecimento: ['0'],
      ...permissionControls
    })
  }

  ngOnInit(): void  {
    this.userAuthenticatedService.getPermissionResource("PERFIL").subscribe(
      (response) => {
        if (!response[0] || !response[0].criacao) {
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

  private async initForm(){
    this.carregarEstabelecimentos()
    this.verificaPermisaso()
  }

  async verificaPermisaso() {
    var userAuthenticated = await this.userAuthenticatedService.getUserLogado()

    if (userAuthenticated.isAdmin) {
      this.shouldShowEstabelecimento = true;
    } else {
      this.shouldShowEstabelecimento = false;
    }

  }

  carregarEstabelecimentos() {
    var userAuthenticated =  this.userAuthenticatedService.getUserLogado()

    this.establishmentService.getEstabelecimento().subscribe({
      next: (response) => {
        this.estabelecimentoOptions = response || [];
      },
      error: (err) => console.error('Erro ao carregar:', err)
    });
  }

  onSubmit(): void {
    console.log('Formulário de perfil enviado:', this.registerProfileForm.value);
    if (this.registerProfileForm.valid) {
      const requestBody = {
        id: 0,
        nome: this.registerProfileForm.get('nome')?.value,
        estabelecimentoId: this.shouldShowEstabelecimento ? this.registerProfileForm.get('estabelecimento')?.value.id : 0,
        permissoes: this.permissions.map(permission => ({
          id: 0,
          controller: permission,
          criacao: this.registerProfileForm.get(`${permission}_criar`)?.value,
          visualizacao: this.registerProfileForm.get(`${permission}_visualizar`)?.value,
          atualizacao: this.registerProfileForm.get(`${permission}_editar`)?.value,
          deletar: this.registerProfileForm.get(`${permission}_deletar`)?.value
        }))
      };
      console.log(requestBody)
      this.profileService.createProfile(requestBody).subscribe(
        (response) => {
          console.log('Perfil registrado com sucesso:', response);
          this.router.navigate(['home']);
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
    this.router.navigate(['home']);
  }
}
